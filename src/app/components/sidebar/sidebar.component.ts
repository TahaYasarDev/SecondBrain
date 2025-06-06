// Angular
import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
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
  constructor(private layoutService: LayoutService, private el: ElementRef) {}

  ngAfterViewInit() {
    const width = this.el.nativeElement.offsetWidth;
    this.layoutService.setSidebarWidth(width);
  }

  @Output() noteSelected = new EventEmitter<string | null>();

  notes: Note[] = [];
  noteCounter = 1;

  selectNote(id: string) {
    this.noteSelected.emit(id);
  }

  addNote() {
    const id = crypto.randomUUID();
    const title = `Note ${this.noteCounter++}`;
    this.notes.push({ id, title });

    this.noteSelected.emit(id);
  }

  editingNoteId: string | null = null;

  enableEdit(id: string, event: MouseEvent) {
    event.stopPropagation(); // pour ne pas déclencher le selectNote
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
}

interface Note {
  id: string;
  title: string;
}
