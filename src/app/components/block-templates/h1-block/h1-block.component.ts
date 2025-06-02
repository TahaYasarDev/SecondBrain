// Angular
import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Component
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';

// Service
import { DragService } from '../../../services/drag.service';

// Shared
import { BaseUiBehavior } from '../../../shared/base-ui-behavior';
import { fadeAnimation } from '../../../shared/animation';
import { ToggleDraggableDirective } from '../../../shared/toggle-draggable.directive';

@Component({
  selector: 'app-h1-block',
  standalone: true,
  imports: [CommonModule, ToggleDraggableDirective, ToolbarBlockComponent],
  templateUrl: './h1-block.component.html',
  styleUrl: './h1-block.component.scss',
  animations: [fadeAnimation],
})
export class H1BlockComponent extends BaseUiBehavior implements AfterViewInit {
  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    this.dragService.initDraggable('.draggable');
  }
}
