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
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    NoteComponent,
    KanbanComponent,
    DashboardComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SecondBrain';

  @ViewChild('viewContainer', { read: ViewContainerRef, static: true })
  viewContainer!: ViewContainerRef;

  noteInstances: Map<string, ComponentRef<NoteComponent>> = new Map();
  kanbanInstances: Map<string, ComponentRef<KanbanComponent>> = new Map();
  dashboardRef: ComponentRef<DashboardComponent> | null = null;

  // DASHBOARD
  openDashboard() {
    this.detachAll(this.noteInstances);
    this.detachAll(this.kanbanInstances);

    // if already present, do not recreate
    if (!this.dashboardRef) {
      this.dashboardRef =
        this.viewContainer.createComponent(DashboardComponent);
    }
  }

  // NOTE
  openNote(noteId: string | null = null) {
    this.detachAll(this.noteInstances);
    this.detachAll(this.kanbanInstances);
    this.destroyDashboard();

    if (noteId && this.noteInstances.has(noteId)) {
      const existingRef = this.noteInstances.get(noteId)!;
      this.viewContainer.insert(existingRef.hostView);
    } else {
      const newId = noteId ?? crypto.randomUUID();
      const noteRef = this.viewContainer.createComponent(NoteComponent);
      noteRef.instance.noteId = newId;
      this.noteInstances.set(newId, noteRef);
    }
  }

  handleDeleteSelectedNote(event: {
    deletedId: string;
    newSelectedId: string | null;
  }) {
    const { deletedId, newSelectedId } = event;

    // delete note
    const ref = this.noteInstances.get(deletedId);
    if (ref) {
      ref.destroy();
      this.noteInstances.delete(deletedId);
    }

    // if there is a note selected after deletion, we display it
    if (newSelectedId) {
      this.openNote(newSelectedId);
    }
  }

  // KANBAN
  openKanban(kanbanId: string | null = null) {
    this.detachAll(this.noteInstances);
    this.detachAll(this.kanbanInstances);
    this.destroyDashboard();

    if (kanbanId && this.kanbanInstances.has(kanbanId)) {
      const existingRef = this.kanbanInstances.get(kanbanId)!;
      this.viewContainer.insert(existingRef.hostView);
      existingRef.instance.show();
    } else {
      const newId = kanbanId ?? crypto.randomUUID();
      const kanbanRef = this.viewContainer.createComponent(KanbanComponent);
      kanbanRef.instance.kanbanId = newId;
      this.kanbanInstances.set(newId, kanbanRef);
    }
  }

  handleDeleteSelectedKanban(event: {
    deletedId: string;
    newSelectedId: string | null;
  }) {
    const { deletedId, newSelectedId } = event;

    // delete kanban
    const ref = this.kanbanInstances.get(deletedId);
    if (ref) {
      ref.destroy();
      this.kanbanInstances.delete(deletedId);
    }

    // if there is a kanban selected after deletion, we display it
    if (newSelectedId) {
      this.openKanban(newSelectedId);
    }
  }

  detachAll(instances: Map<string, ComponentRef<any>>) {
    instances.forEach((ref) => {
      const index = this.viewContainer.indexOf(ref.hostView);
      if (index !== -1) {
        this.viewContainer.detach(index);
      }
    });
  }

  destroyDashboard() {
    if (this.dashboardRef) {
      this.dashboardRef.destroy();
      this.dashboardRef = null;
    }
  }
}
