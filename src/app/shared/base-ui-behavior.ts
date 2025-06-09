// Angular
import { Directive, EventEmitter, Output } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

@Directive()
export abstract class BaseUiBehavior {
  @Output() deleteBalise = new EventEmitter<void>();

  placeHolder: string = 'Écrivez, tapez « / » pour afficher les commandes…';

  isVisible = true;

  hasContent = false;

  // Temporarily set isVisible to false, then back to true
  // This triggers Angular's animation to play again when the component becomes visible
  show() {
    this.isVisible = false;
    setTimeout(() => {
      this.isVisible = true;
    });
  }

  delete() {
    this.isVisible = false;
  }

  onFadeDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.deleteBalise.emit();
    }
  }

  onInput(event: Event) {
    const el = event.target as HTMLElement;
    const text = el.innerText.trim();

    if (text === '') {
      el.innerHTML = '';
    }

    this.hasContent = text.length > 0;
  }
}
