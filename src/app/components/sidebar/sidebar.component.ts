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

    this.noteSelected.emit(id);
  }

  addNote() {
    const id = crypto.randomUUID();
    const title = `Note ${this.noteCounter++}`;
    this.notes.push({ id, title });

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

  // KANBAN

  kanbans: Note[] = [];
  kanbanCounter = 1;
  selectedKanbanId: string | null = null;

  editingKanbanId: string | null = null;

  selectKanban(id: string) {
    this.selectedNoteId = id;

    this.kanbanSelected.emit(id);
  }

  addKanban() {
    const id = crypto.randomUUID();
    const title = `Kanban ${this.kanbanCounter++}`;
    this.kanbans.push({ id, title });

    this.kanbanSelected.emit(id);
  }

  enableKanbanEdit(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.shouldFocusInput = true;
    this.editingKanbanId = id;
  }

  // ALL
  exitEditMode() {
    this.editingNoteId = null;
  }
}

interface Note {
  id: string;
  title: string;
}
