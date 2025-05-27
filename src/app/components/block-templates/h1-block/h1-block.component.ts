import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-h1-block',
  imports: [],
  templateUrl: './h1-block.component.html',
  styleUrl: './h1-block.component.scss',
})
export class H1BlockComponent {
  @Output() deleteH1 = new EventEmitter<void>();

  delete() {
    this.deleteH1.emit();
  }

  onInput(event: Event) {
    const el = event.target as HTMLElement;
    if (el.innerText.trim() === '') {
      el.innerHTML = ''; // force le vrai "vide"
    }
  }
}
