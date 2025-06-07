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

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, NgIf, NgFor, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent {
  @Input() kanbanId!: string;

  backlog: Item[] = [];
  development: Item[] = [];
  inProgress: Item[] = [];
  done: Item[] = [];

  showPopup = false;

  // === gestion popup création / édition ===
  editingItem: Item | null = null; // null si création, sinon item édité
  popupItem: Item = this.createEmptyItem();

  // Ligne éditable (tu peux supprimer si tu gères uniquement via popup)
  lines: string[] = ['', '', '', ''];

  // Drag & drop
  drop(event: CdkDragDrop<Item[]>) {
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

  // Animation (pas modifié)
  isJumping = false;

  startJumpAnimation() {
    if (!this.isJumping) {
      this.isJumping = true;
    }
  }

  onAnimationEnd() {
    this.isJumping = false;
  }

  // Création d'un item vide pour la popup
  createEmptyItem(): Item {
    return {
      jira: '',
      title: '',
      texte: '',
      estimate: 1,
      progress: 0,
    };
  }

  // Ouvrir popup - si item fourni, on édite, sinon création
  openEditPopup(item?: Item) {
    if (item) {
      this.editingItem = item;
      this.popupItem = { ...item }; // clone pour ne pas modifier direct
    } else {
      this.editingItem = null;
      this.popupItem = this.createEmptyItem();
    }
    this.showPopup = true;
  }

  // Sauvegarder popup
  savePopup() {
    if (!this.popupItem.title.trim()) {
      alert('Title is required');
      return;
    }

    if (this.editingItem) {
      // Édition : copier les valeurs dans l’item existant
      Object.assign(this.editingItem, this.popupItem);
    } else {
      // Création : ajouter dans backlog par défaut (ou autre liste)
      this.backlog.push({ ...this.popupItem });
    }
    this.closePopup();
  }

  // Annuler popup
  cancelPopup() {
    this.closePopup();
  }

  // Fermer popup, reset
  private closePopup() {
    this.showPopup = false;
    this.editingItem = null;
    this.popupItem = this.createEmptyItem();
  }

  // Anciennes méthodes, tu peux adapter ou supprimer si tu ne les utilises plus
  handleClick() {
    this.openEditPopup(); // ouvrir en mode création
  }

  // TrackBy pour optimiser ngFor
  trackByFn(index: number, item: Item): string {
    return item.jira;
  }

  ngAfterViewInit(): void {
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach((el) => {
      el.setAttribute('spellcheck', 'false');
    });
  }
}

interface Item {
  jira: string;
  title: string;
  texte: string;
  estimate: number;
  progress: number;
}
