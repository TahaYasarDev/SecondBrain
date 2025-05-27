import { Component, Output, EventEmitter } from '@angular/core';

// Component
import { InsertBlockComponent } from '../../insert-block/insert-block.component';

@Component({
  selector: 'app-paragraph-block',
  imports: [InsertBlockComponent],
  templateUrl: './paragraph-block.component.html',
  styleUrl: './paragraph-block.component.scss',
})
export class ParagraphBlockComponent {
  // Variable permettant le déclenchement de la suppresion du composant
  @Output() delete = new EventEmitter<void>();

  // Variable permettant la création d'une balise
  @Output() createBalise = new EventEmitter<string>();

  // Variable permettant l'envoi de la balise selectionnée
  @Output() baliseSelected = new EventEmitter<string>();

  deleteParagraph() {
    this.delete.emit();
  }

  onInput(event: Event) {
    const el = event.target as HTMLElement;
    if (el.innerText.trim() === '') {
      el.innerHTML = '';
    }
  }

  handleBaliseSelected(balise: string) {
    this.baliseSelected.emit(balise);
    this.createBalise.emit(balise);
  }
}
