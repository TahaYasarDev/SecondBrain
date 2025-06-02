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
  selector: 'app-h3-block',
  standalone: true,
  imports: [CommonModule, ToggleDraggableDirective, ToolbarBlockComponent],
  templateUrl: './h3-block.component.html',
  styleUrl: './h3-block.component.scss',
  animations: [fadeAnimation],
})
export class H3BlockComponent extends BaseUiBehavior implements AfterViewInit {
  interactable: any;

  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    this.interactable = this.dragService.initDraggable('.draggable');
  }
}
