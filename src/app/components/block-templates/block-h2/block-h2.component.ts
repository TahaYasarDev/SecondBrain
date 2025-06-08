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
  selector: 'app-block-h2',
  standalone: true,
  imports: [CommonModule, ToggleDraggableDirective, ToolbarBlockComponent],
  templateUrl: './block-h2.component.html',
  styleUrl: './block-h2.component.scss',
  animations: [fadeAnimation],
})
export class H2BlockComponent
  extends BaseToolbarBehavior
  implements AfterViewInit
{
  interactable: any;

  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    this.interactable = this.dragService.initDraggable('.draggable');
  }
}
