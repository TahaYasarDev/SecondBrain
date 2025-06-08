// Angular
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Component
import { ToolbarBlockComponent } from '../block-toolbar/block-toolbar.component';
import { InsertBlockComponent } from '../block-insert/block-insert.component';

// Service
import { DragService } from '../../../services/drag.service';

// Shared
import { fadeAnimation } from '../../../shared/animation';
import { ToggleDraggableDirective } from '../../../shared/toggle-draggable.directive';
import { BaseToolbarBehavior } from '../../../shared/base-toolbar-behavior';

@Component({
  selector: 'app-block-paragraph',
  standalone: true,
  imports: [
    ToggleDraggableDirective,
    CommonModule,
    ToolbarBlockComponent,
    InsertBlockComponent,
  ],
  templateUrl: './block-paragraph.component.html',
  styleUrl: './block-paragraph.component.scss',
  animations: [fadeAnimation],
})
export class ParagraphBlockComponent
  extends BaseToolbarBehavior
  implements AfterViewInit
{
  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    this.dragService.initDraggable('.draggable');
  }
}
