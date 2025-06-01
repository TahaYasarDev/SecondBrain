// Angular
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

// Component
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';

// Service
import { DragService } from '../../../services/drag.service';

// Shared
import { BaseUiBehavior } from '../../../shared/base-ui-behavior';
import { fadeInAnimation } from '../../../shared/animation';

@Component({
  selector: 'app-h1-block',
  imports: [ToolbarBlockComponent],
  templateUrl: './h1-block.component.html',
  styleUrl: './h1-block.component.scss',
  animations: [fadeInAnimation],
})
export class H1BlockComponent extends BaseUiBehavior implements AfterViewInit {
  @ViewChild('draggableWrapper') draggableWrapper!: ElementRef<HTMLElement>;

  interactable: any;

  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    this.interactable = this.dragService.initDraggable('.draggable');
  }
}
