import {
  Component,
  ComponentRef,
  EventEmitter,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

// Component
import { ParagraphBlockComponent } from '../block-templates/paragraph-block/paragraph-block.component';
import { H1BlockComponent } from '../block-templates/h1-block/h1-block.component';
import { InsertBlockComponent } from '../insert-block/insert-block.component';
import { TextAreaBlockComponent } from '../block-templates/text-area-block/text-area-block.component';
import { TodoBlockComponent } from '../block-templates/todo-block/todo-block.component';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [
    FormsModule,
    InsertBlockComponent,
    H1BlockComponent,
    ParagraphBlockComponent,
    TextAreaBlockComponent,
    TodoBlockComponent,
    CommonModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent {
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  @Output() baliseSelected = new EventEmitter<string>();

  // Stocke toutes les références des composants créés
  componentsRefs: ComponentRef<any>[] = [];

  savedComponentsData: Array<{ type: string; content: string }> = [];

  //#region Méthode pour l'insertion et la suppression des nouveaux blocs

  // Gestion des balises

  // Evènement lors du choix de la balise que l'utilisateur souhaite insérer
  handleBaliseSelected(baliseType: string) {
    this.onInsertBlock(baliseType);
  }

  onInsertBlock(type: string) {
    let componentType: Type<any>;

    switch (type) {
      case 'paragraph':
        componentType = ParagraphBlockComponent;
        break;
      case 'text-area':
        componentType = TextAreaBlockComponent;
        break;
      case 'h1':
        componentType = H1BlockComponent;
        break;
      default:
        return;
    }

    const compRef = this.container.createComponent(componentType);
    this.componentsRefs.push(compRef);

    // Écoute des événements de l'enfant
    if (compRef.instance.deleteParagraph) {
      compRef.instance.deleteParagraph.subscribe(() =>
        this.removeComponent(compRef)
      );
    }

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
  //#endregion

  //#region Méthode pour le nouveau titre de la page
  onInputTitle(event: Event) {
    const el = event.target as HTMLElement;
    if (el.innerText.trim() === '') {
      el.innerHTML = '';
    }
  }
  //#endregion

  //#region Méthode pour le Drag & Drop
  drop(event: CdkDragDrop<ComponentRef<any>[]>) {
    this.componentsRefs = this.swapItems(
      this.componentsRefs,
      event.previousIndex - 1,
      event.currentIndex - 1
    );

    this.renderAll(); // Réinsertion dans l’ordre
  }

  renderAll() {
    this.savedComponentsData = this.componentsRefs.map((ref) => {
      return {
        type: ref.componentType.name.slice(1),
        content: this.getInnerHTMLOfParagraph(
          ref.location.nativeElement.innerHTML
        ),
      };
    });

    this.container.clear();
    this.componentsRefs = [];

    this.savedComponentsData.forEach((component) => {
      let compRef: ComponentRef<any> | null = null;

      switch (component.type) {
        case 'ParagraphBlockComponent':
          compRef = this.container.createComponent(ParagraphBlockComponent);
          compRef.instance.data = component.content;
          break;
        case 'text-area':
          compRef = this.container.createComponent(TextAreaBlockComponent);
          break;
        // etc.
      }

      if (compRef) {
        this.componentsRefs.push(compRef);

        if (compRef.instance.deleteParagraph) {
          compRef.instance.deleteParagraph.subscribe(() =>
            this.removeComponent(compRef!)
          );
        }

        if (compRef.instance.createBalise) {
          compRef.instance.createBalise.subscribe((value: string) =>
            this.onInsertBlock(value)
          );
        }
      }
    });
  }

  getInnerHTMLOfParagraph(htmlString: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    const paragraph = tempDiv.querySelector('p');

    if (paragraph instanceof HTMLParagraphElement) {
      return paragraph.innerHTML.trim();
    }

    return '';
  }

  swapItems<T>(array: T[], from: number, to: number): T[] {
    const temp = array[from];
    array[from] = array[to];
    array[to] = temp;
    return array;
  }
  //#endregion
}
