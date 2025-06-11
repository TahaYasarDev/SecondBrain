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

// Model
import { Ticket } from '../../models/ticket.model';

// Shared
import { fadeAnimation } from '../../shared/animation';
import { BaseUiBehavior } from '../../shared/base-ui-behavior';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, NgIf, NgFor, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
  animations: [fadeAnimation],
})
export class KanbanComponent extends BaseUiBehavior {
  @Input() kanbanId!: string;

  // Columns
  backlog: Ticket[] = [];
  development: Ticket[] = [];
  inProgress: Ticket[] = [];
  done: Ticket[] = [];

  columns = [
    { title: 'Backlog', items: this.backlog },
    { title: 'Development', items: this.development },
    { title: 'In Progress', items: this.inProgress },
    { title: 'Done', items: this.done },
  ];

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

  constructor(private countService: CountService) {
    super();
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

  addColumn() {
    this.columns.push({
      title: 'New Column',
      items: [],
    });
  }

  renameColumn(event: FocusEvent, index: number) {
    const newName = (event.target as HTMLElement).innerText.trim();
    if (newName) this.columns[index].title = newName;
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

    const removedColumn = this.columns[index];

    if (removedColumn.items.length > 0) {
      if (index > 0) {
        this.columns[index - 1].items.push(...removedColumn.items);
      } else if (this.columns.length > 1) {
        this.columns[index + 1].items.push(...removedColumn.items);
      }
    }

    this.columns.splice(index, 1);
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
