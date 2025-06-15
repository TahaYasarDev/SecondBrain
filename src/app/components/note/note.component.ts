// Angular
import {
  AfterViewInit,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

// Component
import { BlockInsertComponent } from '../block-templates/block-insert/block-insert.component';
import { BlockH1Component } from '../block-templates/block-h1/block-h1.component';
import { BlockH2Component } from '../block-templates/block-h2/block-h2.component';
import { BlockH3Component } from '../block-templates/block-h3/block-h3.component';
import { BlockH4Component } from '../block-templates/block-h4/block-h4.component';
import { BlockTodoComponent } from '../block-templates/block-todo/block-todo.component';
import { BlockParagraphComponent } from '../block-templates/block-paragraph/block-paragraph.component';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [
    BlockInsertComponent,
    BlockH1Component,
    BlockH1Component,
    BlockH2Component,
    BlockH3Component,
    BlockH4Component,
    BlockParagraphComponent,
    BlockTodoComponent,
  ],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent implements AfterViewInit {
  @Input() noteId!: string;

  componentsPositions: ComponentPosition[] = [];

  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  @Output() baliseSelected = new EventEmitter<string>();

  // Store all references of the created components
  componentsRefs: ComponentRef<any>[] = [];

  savedComponentsData: Array<{ type: string; content: string }> = [];
  ngAfterViewInit(): void {
    this.onInsertBlock('h1');
  }

  handleBaliseSelected(baliseType: string) {
    this.onInsertBlock(baliseType);
  }

  onInsertBlock(type: string) {
    let componentType: Type<any>;

    switch (type) {
      case 'h1':
        componentType = BlockH1Component;
        break;
      case 'h2':
        componentType = BlockH2Component;
        break;
      case 'h3':
        componentType = BlockH3Component;
        break;
      case 'h4':
        componentType = BlockH4Component;
        break;
      case 'paragraph':
        componentType = BlockParagraphComponent;
        break;
      case 'todo':
        componentType = BlockTodoComponent;
        break;
      default:
        return;
    }

    const compRef = this.container.createComponent(componentType);

    const defaultPos = { x: 0, y: this.componentsRefs.length * 120 };

    // applies the position to the component's DOM
    compRef.location.nativeElement.style.position = 'absolute';
    compRef.location.nativeElement.style.top = defaultPos.y + 'px';
    compRef.location.nativeElement.style.left = defaultPos.x + 'px';
    compRef.location.nativeElement.style.width = '100%';

    this.componentsRefs.push(compRef);

    // listens to the child's events
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
    const index = this.componentsRefs.indexOf(compRef);

    if (index !== -1) {
      compRef.destroy();
      this.componentsRefs.splice(index, 1);
    }
  }
}

interface ComponentPosition {
  x: number;
  y: number;
}
