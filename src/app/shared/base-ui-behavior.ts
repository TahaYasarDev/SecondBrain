import { Directive, EventEmitter, Output } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

@Directive()
export abstract class BaseUiBehavior {
  @Output() deleteBalise = new EventEmitter<void>();

  isVisible = true;

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
    if (el.innerText.trim() === '') {
      el.innerHTML = '';
    }
  }
}
