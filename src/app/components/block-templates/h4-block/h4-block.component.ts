import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationEvent,
} from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-h4-block',
  imports: [],
  templateUrl: './h4-block.component.html',
  styleUrl: './h4-block.component.scss',
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
export class H4BlockComponent {
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

  onInput(event: Event) {
    const el = event.target as HTMLElement;
    if (el.innerText.trim() === '') {
      el.innerHTML = ''; // force le vrai "vide"
    }
  }
}
