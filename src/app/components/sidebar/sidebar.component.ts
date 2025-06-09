// Angular
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Service
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Output() noteSelected = new EventEmitter<string | null>();
  @Output() kanbanSelected = new EventEmitter<string | null>();

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

  // NOTE

  notes: Note[] = [];
  noteCounter = 1;
  selectedNoteId: string | null = null;

  editingNoteId: string | null = null;

  selectNote(id: string) {
    this.selectedNoteId = id;
    this.selectedKanbanId = null;

    this.noteSelected.emit(id);
  }

  addNote() {
    const id = crypto.randomUUID();
    const title = `Note ${this.noteCounter++}`;
    this.notes.push({ id, title });

    this.selectedNoteId = id;
    this.selectedKanbanId = null;

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
    event.stopPropagation(); // évite que le clic sélectionne le kanban

    const index = this.notes.findIndex((k) => k.id === noteId);
    this.notes = this.notes.filter((k) => k.id !== noteId);

    // Si le kanban supprimé était sélectionné, on reset la sélection
    if (this.selectedNoteId === noteId) {
      const previous = this.notes[index - 1];
      const next = this.notes[index];

      if (previous) {
        this.selectedNoteId = previous.id;
      } else if (next) {
        this.selectedNoteId = next.id;
      } else {
        this.selectedNoteId = null;
      }
    }

    this.deleteSelectedNote.emit({
      deletedId: noteId,
      newSelectedId: this.selectedNoteId,
    });
  }

  // KANBAN

  kanbans: Kanban[] = [];
  kanbanCounter = 1;
  selectedKanbanId: string | null = null;

  editingKanbanId: string | null = null;

  selectKanban(id: string) {
    this.selectedKanbanId = id;
    this.selectedNoteId = null;

    this.kanbanSelected.emit(id);
  }

  addKanban() {
    const id = crypto.randomUUID();
    const title = `Kanban ${this.kanbanCounter++}`;
    this.kanbans.push({ id, title });

    this.selectedKanbanId = id;
    this.selectedNoteId = null;

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
    event.stopPropagation(); // évite que le clic sélectionne le kanban

    const index = this.kanbans.findIndex((k) => k.id === kanbanId);
    this.kanbans = this.kanbans.filter((k) => k.id !== kanbanId);

    // Si le kanban supprimé était sélectionné, on reset la sélection
    if (this.selectedKanbanId === kanbanId) {
      const previous = this.kanbans[index - 1];
      const next = this.kanbans[index];

      if (previous) {
        this.selectedKanbanId = previous.id;
      } else if (next) {
        this.selectedKanbanId = next.id;
      } else {
        this.selectedKanbanId = null;
      }
    }

    this.deleteSelectedKanban.emit({
      deletedId: kanbanId,
      newSelectedId: this.selectedKanbanId,
    });
  }
}

interface Note {
  id: string;
  title: string;
}

interface Kanban {
  id: string;
  title: string;
}
