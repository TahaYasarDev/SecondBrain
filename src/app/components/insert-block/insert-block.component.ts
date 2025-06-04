// Angular
import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';

// Service
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'app-insert-block',
  standalone: true,
  imports: [],
  templateUrl: './insert-block.component.html',
  styleUrl: './insert-block.component.scss',
})
export class InsertBlockComponent implements AfterViewInit {
  @Output() baliseSelected = new EventEmitter<string>();

  constructor(private dragService: DragService) {}

  ngAfterViewInit(): void {
    this.dragService.initDraggable('.draggable');
  }

  onBaliseSelected(balise: string) {
    this.baliseSelected.emit(balise);
  }
}
