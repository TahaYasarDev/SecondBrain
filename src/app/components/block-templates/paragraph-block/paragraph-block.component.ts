// Angular
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Component
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';
import { InsertBlockComponent } from '../../insert-block/insert-block.component';

// Service
import { DragService } from '../../../services/drag.service';

// Shared
import { fadeAnimation } from '../../../shared/animation';
import { BaseUiBehavior } from '../../../shared/base-ui-behavior';
import { ToggleDraggableDirective } from '../../../shared/toggle-draggable.directive';

@Component({
  selector: 'app-paragraph-block',
  standalone: true,
  imports: [
    ToggleDraggableDirective,
    CommonModule,
    ToolbarBlockComponent,
    InsertBlockComponent,
  ],
  templateUrl: './paragraph-block.component.html',
  styleUrl: './paragraph-block.component.scss',
  animations: [fadeAnimation],
})
export class ParagraphBlockComponent
  extends BaseUiBehavior
  implements AfterViewInit
{
  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    // drag
    this.dragService.initDraggable('.draggable');
  }
}
