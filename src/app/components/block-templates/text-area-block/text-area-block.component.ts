// Angular
import { AfterViewInit, Component } from '@angular/core';
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
  selector: 'app-text-area-block',
  standalone: true,
  imports: [
    CommonModule,
    ToggleDraggableDirective,
    InsertBlockComponent,
    ToolbarBlockComponent,
  ],
  templateUrl: './text-area-block.component.html',
  styleUrl: './text-area-block.component.scss',
  animations: [fadeAnimation],
})
export class TextAreaBlockComponent
  extends BaseUiBehavior
  implements AfterViewInit
{
  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    this.dragService.initDraggable('.draggable');
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    const textarea = event.target as HTMLTextAreaElement;

    this.hasContent = value.trim().length > 0;

    if (value.length > 100) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    } else {
      textarea.style.height = '50px';
    }
  }
}
