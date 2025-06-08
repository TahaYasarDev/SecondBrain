import {
  Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Component
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NoteComponent } from './components/note/note.component';
import { KanbanComponent } from './components/kanban/kanban.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NoteComponent, KanbanComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SecondBrain';

  @ViewChild('viewContainer', { read: ViewContainerRef, static: true })
  viewContainer!: ViewContainerRef;

  noteInstances: Map<string, ComponentRef<NoteComponent>> = new Map();
  kanbanInstances: Map<string, ComponentRef<KanbanComponent>> = new Map();

  openNote(noteId: string | null = null) {
    // On détache toutes les notes
    this.noteInstances.forEach((ref) => {
      const viewIndex = this.viewContainer.indexOf(ref.hostView);
      if (viewIndex !== -1) {
        this.viewContainer.detach(viewIndex);
      }
    });

    // On détache aussi tous les kanbans
    this.kanbanInstances.forEach((ref) => {
      const viewIndex = this.viewContainer.indexOf(ref.hostView);
      if (viewIndex !== -1) {
        this.viewContainer.detach(viewIndex);
      }
    });

    if (noteId && this.noteInstances.has(noteId)) {
      const existingRef = this.noteInstances.get(noteId)!;
      this.viewContainer.insert(existingRef.hostView);
    } else {
      const newId = noteId ?? crypto.randomUUID();
      const noteRef = this.viewContainer.createComponent(NoteComponent);
      noteRef.instance.noteId = newId;
      this.viewContainer.insert(noteRef.hostView); // Ne pas oublier de l'insérer
      this.noteInstances.set(newId, noteRef);
    }
  }

  openKanban(kanbanId: string | null = null) {
    // On détache toutes les notes
    this.noteInstances.forEach((ref) => {
      const viewIndex = this.viewContainer.indexOf(ref.hostView);
      if (viewIndex !== -1) {
        this.viewContainer.detach(viewIndex);
      }
    });

    // On détache aussi tous les kanbans
    this.kanbanInstances.forEach((ref) => {
      const viewIndex = this.viewContainer.indexOf(ref.hostView);
      if (viewIndex !== -1) {
        this.viewContainer.detach(viewIndex);
      }
    });

    if (kanbanId && this.kanbanInstances.has(kanbanId)) {
      const existingRef = this.kanbanInstances.get(kanbanId)!;
      this.viewContainer.insert(existingRef.hostView);
    } else {
      const newId = kanbanId ?? crypto.randomUUID();
      const kanbanRef = this.viewContainer.createComponent(KanbanComponent);
      kanbanRef.instance.kanbanId = newId;
      this.viewContainer.insert(kanbanRef.hostView); // Ne pas oublier de l'insérer
      this.kanbanInstances.set(newId, kanbanRef);
    }
  }
}
