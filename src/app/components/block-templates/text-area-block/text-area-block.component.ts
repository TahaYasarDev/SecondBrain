// Angular
import { AfterViewInit, Component } from '@angular/core';

// Component
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';
import { InsertBlockComponent } from '../../insert-block/insert-block.component';

// Shared
import { fadeInAnimation } from '../../../shared/animation';
import { BaseUiBehavior } from '../../../shared/base-ui-behavior';

// Service
import { DragService } from '../../../services/drag.service';

@Component({
  selector: 'app-text-area-block',
  standalone: true,
  imports: [InsertBlockComponent, ToolbarBlockComponent],
  templateUrl: './text-area-block.component.html',
  styleUrl: './text-area-block.component.scss',
  animations: [fadeInAnimation],
})
export class TextAreaBlockComponent
  extends BaseUiBehavior
  implements AfterViewInit
{
  interactable: any;

  constructor(private dragService: DragService) {
    super();
  }

  ngAfterViewInit(): void {
    this.interactable = this.dragService.initDraggable('.draggable');
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    const textarea = event.target as HTMLTextAreaElement;

    if (value.length > 100) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    } else {
      textarea.style.height = '50px';
    }
  }
}
