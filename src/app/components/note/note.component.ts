import {
  Component,
  ComponentRef,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

// Component
import { ParagraphBlockComponent } from '../block-templates/paragraph-block/paragraph-block.component';
import { H1BlockComponent } from '../block-templates/h1-block/h1-block.component';
import { InsertBlockComponent } from '../insert-block/insert-block.component';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [
    FormsModule,
    InsertBlockComponent,
    H1BlockComponent,
    ParagraphBlockComponent,
  ],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @Output() baliseSelected = new EventEmitter<string>();

  // Stocke toutes les références des composants créés
  componentsRefs: ComponentRef<any>[] = [];

  // Evènement lors du choix de la balise que l'utilisateur souhaite insérer
  handleBaliseSelected(baliseType: string) {
    this.onInsertBlock(baliseType);
  }

  // Création d'une balise
  onInsertBlock(type: string) {
    let compRef: ComponentRef<any>;

    switch (type) {
      case 'paragraph':
        compRef = this.container.createComponent(ParagraphBlockComponent);
        break;
      case 'heading':
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

  onInputChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    const textarea = event.target as HTMLTextAreaElement;

    if (value.length > 100) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    } else {
      textarea.style.height = '50px';
    }
  }
}
