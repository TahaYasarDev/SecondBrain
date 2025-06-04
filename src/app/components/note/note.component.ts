// Angular
import {
  Component,
  ComponentRef,
  EventEmitter,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

// Component
import { InsertBlockComponent } from '../insert-block/insert-block.component';
import { H1BlockComponent } from '../block-templates/h1-block/h1-block.component';
import { H2BlockComponent } from '../block-templates/h2-block/h2-block.component';
import { H3BlockComponent } from '../block-templates/h3-block/h3-block.component';
import { H4BlockComponent } from '../block-templates/h4-block/h4-block.component';
import { ParagraphBlockComponent } from '../block-templates/paragraph-block/paragraph-block.component';
import { TodoBlockComponent } from '../block-templates/todo-block/todo-block.component';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [
    InsertBlockComponent,
    H1BlockComponent,
    H1BlockComponent,
    H2BlockComponent,
    H3BlockComponent,
    H4BlockComponent,
    ParagraphBlockComponent,
    TodoBlockComponent,
  ],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent {
  componentsPositions: ComponentPosition[] = [];

  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  @Output() baliseSelected = new EventEmitter<string>();

  // Stocke toutes les références des composants créés
  componentsRefs: ComponentRef<any>[] = [];

  savedComponentsData: Array<{ type: string; content: string }> = [];

  // Evènement lors du choix de la balise que l'utilisateur souhaite insérer
  handleBaliseSelected(baliseType: string) {
    this.onInsertBlock(baliseType);
  }

  onInsertBlock(type: string) {
    let componentType: Type<any>;

    switch (type) {
      case 'h1':
        componentType = H1BlockComponent;
        break;
      case 'h2':
        componentType = H2BlockComponent;
        break;
      case 'h3':
        componentType = H3BlockComponent;
        break;
      case 'h4':
        componentType = H4BlockComponent;
        break;
      case 'paragraph':
        componentType = ParagraphBlockComponent;
        break;
      case 'todo':
        componentType = TodoBlockComponent;
        break;
      default:
        return;
    }

    const compRef = this.container.createComponent(componentType);

    const defaultPos = { x: 0, y: this.componentsRefs.length * 120 };

    // Applique la position au DOM du composant
    compRef.location.nativeElement.style.position = 'absolute';
    compRef.location.nativeElement.style.top = defaultPos.y + 'px';
    compRef.location.nativeElement.style.left = defaultPos.x + 'px';
    compRef.location.nativeElement.style.width = '100%';

    this.componentsRefs.push(compRef);

    // Écoute des événements de l'enfant
    if (compRef.instance.deleteBalise) {
      compRef.instance.deleteBalise.subscribe(() =>
        this.removeComponent(compRef)
      );
    }

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
}

interface ComponentPosition {
  x: number;
  y: number;
}
