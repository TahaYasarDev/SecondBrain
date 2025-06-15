// Angular
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Service
import { LayoutService } from '../../services/layout.service';

//Shared
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    const el = document.querySelector('.secondBrain') as HTMLElement;
    if (el) {
      if (this.menuOpen) {
        el.classList.add('isVisible');
      } else {
        el.classList.remove('isVisible');
      }
    }
  }

  isMobile(): boolean {
    return window.innerWidth <= 375;
  }

  @Input() activeSection: 'dashboard' | 'note' | 'kanban' | null = null;

  @Output() noteSelected = new EventEmitter<string | null>();
  @Output() kanbanSelected = new EventEmitter<string | null>();
  @Output() dashboardSelected = new EventEmitter<void>();
  @Output() settingSelected = new EventEmitter<void>();

  @Output() deleteSelectedNote = new EventEmitter<{
    deletedId: string;
    newSelectedId: string | null;
  }>();
  @Output() deleteSelectedKanban = new EventEmitter<{
    deletedId: string;
    newSelectedId: string | null;
  }>();

  @ViewChild('editInput') editInput?: ElementRef<HTMLInputElement>;

  shouldFocusInput = false;

  constructor(private layoutService: LayoutService, private el: ElementRef) {}

  ngOnInit() {
    this.isDashboardActive = this.activeSection === 'dashboard';
  }

  ngAfterViewInit() {
    const width = this.el.nativeElement.offsetWidth;
    this.layoutService.setSidebarWidth(width);
  }

  ngAfterViewChecked() {
    if (this.shouldFocusInput && this.editInput) {
      this.editInput.nativeElement.focus();
      this.shouldFocusInput = false;
    }
  }

  //#region Dashboard
  isDashboardActive = false;

  showDashboard() {
    this.isDashboardActive = true;
    this.selectedKanbanId = null;
    this.selectedNoteId = null;
    this.isSettingActive = false;

    this.dashboardSelected.emit();
  }
  //#endregion

  //#region Note
  notes: Note[] = [];
  noteCounter = 1;
  selectedNoteId: string | null = null;

  editingNoteId: string | null = null;

  selectNote(id: string) {
    this.selectedNoteId = id;
    this.selectedKanbanId = null;
    this.isDashboardActive = false;
    this.isSettingActive = false;

    this.noteSelected.emit(id);
  }

  addNote(formSidebarTitle: boolean = false) {
    if (formSidebarTitle && this.notes.length > 0) {
      return;
    }

    const id = crypto.randomUUID();
    const title = `Note ${this.noteCounter++}`;
    this.notes.push({ id, title });

    this.selectedNoteId = id;
    this.selectedKanbanId = null;
    this.isDashboardActive = false;

    this.noteSelected.emit(id);
  }

  enableEdit(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.shouldFocusInput = true;
    this.editingNoteId = id;
  }

  saveTitle(id: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const newTitle = input.value.trim();

    const note = this.notes.find((n) => n.id === id);
    if (note && newTitle) {
      note.title = newTitle;
    }

    this.editingNoteId = null;
  }

  deleteNote(noteId: string, event: MouseEvent) {
    event.stopPropagation();

    const index = this.notes.findIndex((k) => k.id === noteId);
    this.notes = this.notes.filter((k) => k.id !== noteId);

    // note selection
    if (this.selectedNoteId === noteId) {
      const previous = this.notes[index - 1];
      const next = this.notes[index];

      if (previous) {
        this.selectedNoteId = previous.id;
      } else if (next) {
        this.selectedNoteId = next.id;
      } else {
        this.selectedNoteId = null;
        this.isDashboardActive = false;
      }
    }

    this.deleteSelectedNote.emit({
      deletedId: noteId,
      newSelectedId: this.selectedNoteId,
    });
  }
  //#endregion

  //#region Kanban
  kanbans: Kanban[] = [];
  kanbanCounter = 1;
  selectedKanbanId: string | null = null;

  editingKanbanId: string | null = null;

  selectKanban(id: string) {
    this.selectedKanbanId = id;
    this.selectedNoteId = null;
    this.isDashboardActive = false;
    this.isSettingActive = false;

    this.kanbanSelected.emit(id);
  }

  addKanban(formSidebarTitle: boolean = false) {
    if (formSidebarTitle && this.kanbans.length > 0) {
      return;
    }

    const id = crypto.randomUUID();
    const title = `Kanban ${this.kanbanCounter++}`;
    this.kanbans.push({ id, title });

    this.selectedKanbanId = id;
    this.selectedNoteId = null;
    this.isDashboardActive = false;
    this.isSettingActive = false;

    this.kanbanSelected.emit(id);
  }

  enableKanbanEdit(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.shouldFocusInput = true;
    this.editingKanbanId = id;
  }

  saveKanbanTitle(id: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const newTitle = input.value.trim();

    const kanban = this.kanbans.find((n) => n.id === id);
    if (kanban && newTitle) {
      kanban.title = newTitle;
    }

    this.editingKanbanId = null;
  }

  deleteKanban(kanbanId: string, event: MouseEvent) {
    event.stopPropagation();

    const index = this.kanbans.findIndex((k) => k.id === kanbanId);
    this.kanbans = this.kanbans.filter((k) => k.id !== kanbanId);

    // kanban selection
    if (this.selectedKanbanId === kanbanId) {
      const previous = this.kanbans[index - 1];
      const next = this.kanbans[index];

      if (previous) {
        this.selectedKanbanId = previous.id;
      } else if (next) {
        this.selectedKanbanId = next.id;
      } else {
        this.selectedKanbanId = null;
        this.isDashboardActive = false;
        this.isSettingActive = false;
      }
    }

    this.deleteSelectedKanban.emit({
      deletedId: kanbanId,
      newSelectedId: this.selectedKanbanId,
    });
  }
  //#endregion

  //#region Setting
  isSettingActive = false;

  showSetting() {
    this.isSettingActive = true;
    this.isDashboardActive = false;
    this.selectedKanbanId = null;
    this.selectedNoteId = null;

    this.settingSelected.emit();
  }
  //#endregion
}

interface Note {
  id: string;
  title: string;
}

interface Kanban {
  id: string;
  title: string;
}
