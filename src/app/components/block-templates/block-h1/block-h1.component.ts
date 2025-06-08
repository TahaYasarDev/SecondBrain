// Angular
import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Component
import { ToolbarBlockComponent } from '../block-toolbar/block-toolbar.component';

// Service
import { DragService } from '../../../services/drag.service';

// Shared
import { fadeAnimation } from '../../../shared/animation';
import { ToggleDraggableDirective } from '../../../shared/toggle-draggable.directive';
import { BaseToolbarBehavior } from '../../../shared/base-toolbar-behavior';

@Component({
  selector: 'app-block-h1',
  standalone: true,
  imports: [CommonModule, ToggleDraggableDirective, ToolbarBlockComponent],
  templateUrl: './block-h1.component.html',
  styleUrl: './block-h1.component.scss',
  animations: [fadeAnimation],
})
export class H1BlockComponent
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
