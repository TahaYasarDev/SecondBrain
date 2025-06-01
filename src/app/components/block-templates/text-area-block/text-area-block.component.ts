// Component
import { InsertBlockComponent } from '../../insert-block/insert-block.component';

import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationEvent,
} from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';

@Component({
  selector: 'app-text-area-block',
  imports: [InsertBlockComponent, ToolbarBlockComponent],
  templateUrl: './text-area-block.component.html',
  styleUrl: './text-area-block.component.scss',
  animations: [
    trigger('fadeIn', [
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('visible => hidden', animate('500ms ease-out')),
      transition('hidden => visible', animate('500ms ease-in')),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out'),
      ]),
      transition(':leave', [
        animate(
          '500ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class TextAreaBlockComponent {
  isVisible = true;

  @Output() deleteBalise = new EventEmitter<void>();

  delete() {
    this.isVisible = false; // déclenche l'animation 'hidden'
  }

  onFadeDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.deleteBalise.emit();
    }
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
