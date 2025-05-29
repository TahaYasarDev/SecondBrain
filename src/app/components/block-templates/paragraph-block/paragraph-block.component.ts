import { Component, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent,
} from '@angular/animations';

// Component
import { InsertBlockComponent } from '../../insert-block/insert-block.component';

@Component({
  selector: 'app-paragraph-block',
  imports: [InsertBlockComponent],
  templateUrl: './paragraph-block.component.html',
  styleUrl: './paragraph-block.component.scss',
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
export class ParagraphBlockComponent {
  // Variable permettant le déclenchement de la suppresion du composant
  @Output() deleteParagraph = new EventEmitter<void>();

  // Variable permettant la création d'une balise
  @Output() createBalise = new EventEmitter<string>();

  // Variable permettant l'envoi de la balise selectionnée
  @Output() baliseSelected = new EventEmitter<string>();

  isVisible = true;

  data: string = '<strong>TEST</strong>';

  delete() {
    this.isVisible = false; // déclenche l'animation 'hidden'
  }

  onFadeDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.deleteParagraph.emit();
    }
  }

  onInput(event: Event) {
    const el = event.target as HTMLElement;
    if (el.innerText.trim() === '') {
      el.innerHTML = '';
    } else {
      this.data = el.innerText;
    }
  }

  handleBaliseSelected(balise: string) {
    this.baliseSelected.emit(balise);
    this.createBalise.emit(balise);
  }
}
