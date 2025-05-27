import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-insert-block',
  imports: [],
  templateUrl: './insert-block.component.html',
  styleUrl: './insert-block.component.scss',
})
export class InsertBlockComponent {
  @Output() baliseSelected = new EventEmitter<string>();

  onBaliseSelected(balise: string) {
    this.baliseSelected.emit(balise);
  }
}
