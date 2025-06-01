// Angular
import { AfterViewInit, Component } from '@angular/core';

// Component
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';

// Service
import { DragService } from '../../../services/drag.service';

// Shared
import { BaseUiBehavior } from '../../../shared/base-ui-behavior';
import { fadeInAnimation } from '../../../shared/animation';

@Component({
  selector: 'app-h3-block',
  standalone: true,
  imports: [ToolbarBlockComponent],
  templateUrl: './h3-block.component.html',
  styleUrl: './h3-block.component.scss',
  animations: [fadeInAnimation],
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
