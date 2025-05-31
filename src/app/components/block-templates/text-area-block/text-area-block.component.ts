import { Component, EventEmitter, Output } from '@angular/core';

// Component
import { InsertBlockComponent } from '../../insert-block/insert-block.component';

@Component({
  selector: 'app-text-area-block',
  imports: [InsertBlockComponent],
  templateUrl: './text-area-block.component.html',
  styleUrl: './text-area-block.component.scss',
})
export class TextAreaBlockComponent {
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
