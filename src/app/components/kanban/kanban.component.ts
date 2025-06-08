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
      estimate: null,
      progress: null,
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
      this.columns[0].items.push({ ...this.popupItem });
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

  estimateError = false;
  progressError = false;

  allowOnlyNumbers(event: KeyboardEvent, field: 'estimate' | 'progress') {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
      ',', // Ajout de la virgule ici
    ];

    // Regex modifiée : chiffre ou virgule
    if (!allowedKeys.includes(event.key) && !/^[\d,]$/.test(event.key)) {
      event.preventDefault();

      // Activer l'erreur correspondante
      if (field === 'estimate') {
        this.estimateError = true;
      } else if (field === 'progress') {
        this.progressError = true;
      }
    } else {
      // Pas d'erreur si la touche est valide
      if (field === 'estimate') {
        this.estimateError = false;
      } else if (field === 'progress') {
        this.progressError = false;
      }
    }
  }

  columns = [
    { title: 'Backlog', items: this.backlog },
    { title: 'Selected for Development', items: this.development },
    { title: 'In Progress', items: this.inProgress },
    { title: 'Done', items: this.done },
  ];

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
    if (index > 0) connected.push(`cdk-drop-list-${index - 1}`); // colonne précédente
    if (index < this.columns.length - 1)
      connected.push(`cdk-drop-list-${index + 1}`); // colonne suivante
    return connected;
  }

  deleteColumn(index: number) {
    const confirmed = confirm(
      `Supprimer la colonne "${this.columns[index].title}" ?`
    );
    if (!confirmed) return;

    // Récupérer la colonne à supprimer
    const removedColumn = this.columns[index];

    // Déplacer les tickets vers la colonne précédente si possible, sinon vers la suivante
    if (removedColumn.items.length > 0) {
      if (index > 0) {
        // Ajouter les tickets dans la colonne précédente
        this.columns[index - 1].items.push(...removedColumn.items);
      } else if (this.columns.length > 1) {
        // Sinon ajouter dans la colonne suivante (si pas la seule colonne)
        this.columns[index + 1].items.push(...removedColumn.items);
      }
      // Sinon il n’y a pas d’autre colonne, donc les tickets seront supprimés avec la colonne
    }

    // Supprimer la colonne
    this.columns.splice(index, 1);
  }
}

interface Item {
  jira: string;
  title: string;
  texte: string;
  estimate?: number | null;
  progress?: number | null;
}
