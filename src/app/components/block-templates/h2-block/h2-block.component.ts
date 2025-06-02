// Angular
import { AfterViewInit, Component } from '@angular/core';

// Component
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';

// Service
import { DragService } from '../../../services/drag.service';

// Shared
import { BaseUiBehavior } from '../../../shared/base-ui-behavior';
import { fadeInAnimation } from '../../../shared/animation';
import { ToggleDraggableDirective } from '../../../shared/toggle-draggable.directive';

@Component({
  selector: 'app-h2-block',
  standalone: true,
  imports: [ToggleDraggableDirective, ToolbarBlockComponent],
  templateUrl: './h2-block.component.html',
  styleUrl: './h2-block.component.scss',
  animations: [fadeInAnimation],
})
export class H2BlockComponent extends BaseUiBehavior implements AfterViewInit {
  interactable: any;

  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    this.interactable = this.dragService.initDraggable('.draggable');
  }
}
