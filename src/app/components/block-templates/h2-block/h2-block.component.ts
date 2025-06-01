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
  selector: 'app-h2-block',
  imports: [ToolbarBlockComponent],
  templateUrl: './h2-block.component.html',
  styleUrl: './h2-block.component.scss',
  animations: [fadeInAnimation],
})
export class H2BlockComponent extends BaseUiBehavior implements AfterViewInit {
  @ViewChild('draggableWrapper') draggableWrapper!: ElementRef<HTMLElement>;

  interactable: any;

  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    this.interactable = this.dragService.initDraggable('.draggable');
  }
}
