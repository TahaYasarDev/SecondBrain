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
import { SettingComponent } from './components/setting/setting.component';

// Service
import { ThemeService } from './services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    NoteComponent,
    KanbanComponent,
    DashboardComponent,
    SettingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SecondBrain';

  @ViewChild('viewContainer', { read: ViewContainerRef, static: true })
  viewContainer!: ViewContainerRef;

  sideBarActiveSection: 'dashboard' | 'note' | 'kanban' | null = null;

  noteInstances: Map<string, ComponentRef<NoteComponent>> = new Map();
  kanbanInstances: Map<string, ComponentRef<KanbanComponent>> = new Map();
  dashboardRef: ComponentRef<DashboardComponent> | null = null;
  settingRef: ComponentRef<SettingComponent> | null = null;

  constructor(
    private themeService: ThemeService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {
    // apply the correct icon colors from the start
    this.themeService.updateIcons(this.themeService.currentTheme);

    // update icons every time the theme changes
    this.themeService.isDarkTheme$.subscribe((isDark) => {
      this.themeService.updateIcons(isDark);
    });

    // also observe newly added elements to update their icons
    this.themeService.observeIconChanges();

    setTimeout(() => {
      this.dashboardRef =
        this.viewContainer.createComponent(DashboardComponent);
      this.sideBarActiveSection = 'dashboard';
    }, 200);
  }

  //#region Dashboard
  openDashboard() {
    this.detachAll(this.noteInstances);
    this.detachAll(this.kanbanInstances);
    this.destroySetting();

    // if already present, do not recreate
    if (!this.dashboardRef) {
      this.dashboardRef =
        this.viewContainer.createComponent(DashboardComponent);
    }
  }

  destroyDashboard() {
    if (this.dashboardRef) {
      this.dashboardRef.destroy();
      this.dashboardRef = null;
    }
  }
  //#endregion

  //#region Note
  openNote(noteId: string | null = null) {
    this.detachAll(this.noteInstances);
    this.detachAll(this.kanbanInstances);
    this.destroyDashboard();
    this.destroySetting();

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
  //#endregion

  //#region Kanban
  openKanban(kanbanId: string | null = null) {
    this.detachAll(this.noteInstances);
    this.detachAll(this.kanbanInstances);
    this.destroyDashboard();
    this.destroySetting();

    if (kanbanId && this.kanbanInstances.has(kanbanId)) {
      const existingRef = this.kanbanInstances.get(kanbanId)!;
      this.viewContainer.insert(existingRef.hostView);
      existingRef.instance.show();
      existingRef.instance.loadData();
      existingRef.instance.refreshTranslations();
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
  //#endregion

  //#region Setting
  openSetting() {
    this.detachAll(this.noteInstances);
    this.detachAll(this.kanbanInstances);
    this.destroyDashboard();

    if (!this.settingRef) {
      this.settingRef = this.viewContainer.createComponent(SettingComponent);
    }
  }

  destroySetting() {
    if (this.settingRef) {
      this.settingRef.destroy();
      this.settingRef = null;
    }
  }
  //#endregion

  detachAll(instances: Map<string, ComponentRef<any>>) {
    instances.forEach((ref) => {
      const index = this.viewContainer.indexOf(ref.hostView);
      if (index !== -1) {
        this.viewContainer.detach(index);
      }
    });
  }
}
