// Angular
import { Directive, EventEmitter, Output } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

@Directive()
export abstract class BaseUiBehavior {
  @Output() deleteBalise = new EventEmitter<void>();

  isVisible = true;

  hasContent = false;

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
