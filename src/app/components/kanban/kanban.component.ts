// Angular
import { Component, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Service
import { CountService } from '../../services/count.service';
import { KanbanService } from '../../services/kanban.service';

// Model
import { Ticket } from '../../models/ticket.model';
import { Column } from '../../models/column';

// Shared
import { fadeAnimation } from '../../shared/animation';
import { BaseUiBehavior } from '../../shared/base-ui-behavior';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, NgIf, NgFor, FormsModule, TranslateModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
  animations: [fadeAnimation],
})
export class KanbanComponent extends BaseUiBehavior {
  @Input() kanbanId!: string;

  kanbanService!: KanbanService;

  // Columns
  backlog: Ticket[] = [];
  development: Ticket[] = [];
  inProgress: Ticket[] = [];
  done: Ticket[] = [];

  columns: Column[] = [];

  // Popup
  showPopup = false;
  popupItem: Ticket = this.createEmptyItem();
  editingItem: Ticket | null = null;

  // Animation
  isJumping = false;
  isJumpingColumn = false;

  // Error message
  estimateError = false;
  timeSpentError = false;
  progressError = false;

  constructor(
    private countService: CountService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.kanbanService = new KanbanService(this.kanbanId);
    this.loadData();
  }

  ngAfterViewInit(): void {
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach((el) => {
      el.setAttribute('spellcheck', 'false');
    });
  }

  ngOnDestroy(): void {
    this.countService.deleteKanban(this.kanbanId);
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  //#region  Animation

  startJumpAnimation() {
    if (!this.isJumping) {
      this.isJumping = true;
    }
  }

  startJumpAnimationColumn() {
    if (!this.isJumpingColumn) {
      this.isJumpingColumn = true;
    }
  }

  onAnimationEnd() {
    this.isJumping = false;
    this.isJumpingColumn = false;
  }

  //#endregion

  //#region Popup

  createEmptyItem(): Ticket {
    return {
      jira: '',
      title: '',
      texte: '',
      estimate: null,
      progress: null,
    };
  }

  openEditPopup(ticket?: Ticket) {
    if (ticket) {
      this.editingItem = ticket;
      this.popupItem = { ...ticket }; // clone to avoid modifying directly
    } else {
      this.editingItem = null;
      this.popupItem = this.createEmptyItem();
    }
    this.showPopup = true;
  }

  savePopup() {
    if (!this.popupItem.title.trim()) {
      alert('Title is required');
      return;
    }

    if (this.editingItem) {
      Object.assign(this.editingItem, this.popupItem);
    } else {
      this.columns[0].items.push({ ...this.popupItem });
    }

    this.updateItemsInCountService();
    this.closePopup();
  }

  cancelPopup() {
    this.closePopup();
  }

  private closePopup() {
    this.showPopup = false;
    this.editingItem = null;
    this.popupItem = this.createEmptyItem();
  }

  deleteTask(columnIndex: number, itemIndex: number) {
    const task = this.columns[columnIndex].items[itemIndex];
    const confirmed = confirm(`Supprimer la tâche "${task.title}" ?`);
    if (confirmed) {
      this.columns[columnIndex].items.splice(itemIndex, 1);
    }
    this.updateItemsInCountService();
  }

  updateItemsInCountService() {
    const allItems = this.columns.flatMap((col) => col.items);
    this.countService.updateKanbanItems(this.kanbanId, allItems);
  }

  //#endregion

  //#region Handle columns

  loadData() {
    const savedColumns = this.kanbanService.getColumns();

    // Si des colonnes sont déjà sauvegardées, on les utilise directement
    if (savedColumns.length > 0) {
      this.columns = savedColumns;
      return;
    }

    // Sinon, on charge les titres traduits et on crée les colonnes
    this.translate
      .get([
        'kanban-column-one-title',
        'kanban-column-two-title',
        'kanban-column-three-title',
        'kanban-column-four-title',
      ])
      .subscribe((translations) => {
        this.columns = [
          {
            title: translations['kanban-column-one-title'],
            items: this.backlog,
          },
          {
            title: translations['kanban-column-two-title'],
            items: this.development,
          },
          {
            title: translations['kanban-column-three-title'],
            items: this.inProgress,
          },
          {
            title: translations['kanban-column-four-title'],
            items: this.done,
          },
        ];

        this.kanbanService.updateColumns(this.columns);
      });
  }

  addColumn() {
    const newTitle = this.translate.instant('kanban-new-column-title');
    this.columns.push({ title: newTitle, items: [], isTitleCustom: false });
    this.kanbanService.updateColumns(this.columns);
  }

  // Renommer une colonne
  renameColumn(event: any, index: number) {
    const newTitle = event.target.innerText.trim();
    if (newTitle.length > 0) {
      this.columns[index].title = newTitle;
      this.columns[index].isTitleCustom = true;
      this.kanbanService.updateColumns(this.columns);
    }
  }

  getConnectedDropLists(index: number): string[] {
    const connected = [];
    if (index > 0) connected.push(`cdk-drop-list-${index - 1}`);
    if (index < this.columns.length - 1)
      connected.push(`cdk-drop-list-${index + 1}`);
    return connected;
  }

  deleteColumn(index: number) {
    const confirmed = confirm(
      `Supprimer la colonne "${this.columns[index].title}" ?`
    );
    if (!confirmed) return;

    this.kanbanService.deleteColumn(index);
  }

  refreshTranslations() {
    this.translate
      .get([
        'kanban-column-one-title',
        'kanban-column-two-title',
        'kanban-column-three-title',
        'kanban-column-four-title',
        'kanban-new-column-title',
      ])
      .subscribe((translations) => {
        this.columns.forEach((col, i) => {
          if (!col.isTitleCustom) {
            switch (i) {
              case 0:
                col.title = translations['kanban-column-one-title'];
                break;
              case 1:
                col.title = translations['kanban-column-two-title'];
                break;
              case 2:
                col.title = translations['kanban-column-three-title'];
                break;
              case 3:
                col.title = translations['kanban-column-four-title'];
                break;
              default:
                col.title = translations['kanban-new-column-title'];
            }
          }
        });
      });
  }

  //#endregion

  trackByFn(index: number, ticket: Ticket): string {
    return ticket.jira;
  }

  // Form verification
  allowOnlyNumbers(
    event: KeyboardEvent,
    field: 'estimate' | 'timeSpent' | 'progress'
  ) {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
      ',',
    ];

    if (!allowedKeys.includes(event.key) && !/^[\d,]$/.test(event.key)) {
      event.preventDefault();
      if (field === 'estimate') {
        this.estimateError = true;
      } else if (field === 'timeSpent') {
        this.timeSpentError = true;
      } else {
        this.progressError = true;
      }
    } else {
      if (field === 'estimate') {
        this.estimateError = false;
      } else if (field === 'timeSpent') {
        this.timeSpentError = false;
      } else {
        this.progressError = false;
      }
    }
  }
}
