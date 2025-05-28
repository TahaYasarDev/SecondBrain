import {
  Component,
  ComponentRef,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Component
import { ParagraphBlockComponent } from '../block-templates/paragraph-block/paragraph-block.component';
import { H1BlockComponent } from '../block-templates/h1-block/h1-block.component';
import { InsertBlockComponent } from '../insert-block/insert-block.component';
import { TextAreaBlockComponent } from '../block-templates/text-area-block/text-area-block.component';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [
    FormsModule,
    InsertBlockComponent,
    H1BlockComponent,
    ParagraphBlockComponent,
    TextAreaBlockComponent,
    CommonModule,
  ],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @ViewChild('initialParagraph') initialParagraph!: ParagraphBlockComponent;

  @Output() baliseSelected = new EventEmitter<string>();

  @Output() deleteParagraph = new EventEmitter<string>();

  showInitialParagraph: boolean = true;

  // Stocke toutes les références des composants créés
  componentsRefs: ComponentRef<any>[] = [];

  // Evènement lors du choix de la balise que l'utilisateur souhaite insérer
  handleBaliseSelected(baliseType: string) {
    this.onInsertBlock(baliseType);
  }

  // Evènement lors du choix de la balise que l'utilisateur souhaite insérer
  handleDeleteParagraph() {
    this.showInitialParagraph = false;
  }

  showParagraph() {
    if (this.initialParagraph == null) {
      this.showInitialParagraph = true;
    }
  }

  // Création d'une balise
  onInsertBlock(type: string) {
    let compRef: ComponentRef<any>;

    switch (type) {
      case 'paragraph':
        compRef = this.container.createComponent(ParagraphBlockComponent);
        break;
      case 'text-area':
        compRef = this.container.createComponent(TextAreaBlockComponent);
        break;
      case 'h1':
        compRef = this.container.createComponent(H1BlockComponent);
        break;
      default:
        return;
    }

    this.componentsRefs.push(compRef);

    // On écoute / s'abonne la propriété delete de l'enfant
    if (compRef.instance.delete) {
      compRef.instance.delete.subscribe(() => this.removeComponent(compRef));
    }

    // On écoute / s'abonne la propriété delete de l'enfant
    if (compRef.instance.createBalise) {
      compRef.instance.createBalise.subscribe((value: string) =>
        this.onInsertBlock(value)
      );
    }
  }

  // Suppression d'un composant
  removeComponent(compRef: ComponentRef<any>) {
    // Trouve l'index dans le tableau
    const index = this.componentsRefs.indexOf(compRef);

    if (index !== -1) {
      // Supprime le composant de l’affichage
      compRef.destroy();

      // Retire la référence du tableau
      this.componentsRefs.splice(index, 1);
    }
  }

  onInputTitle(event: Event) {
    const el = event.target as HTMLElement;
    if (el.innerText.trim() === '') {
      el.innerHTML = '';
    }
  }
}
