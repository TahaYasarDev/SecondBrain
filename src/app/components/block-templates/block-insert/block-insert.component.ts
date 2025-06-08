// Angular
import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';

// Service
import { DragService } from '../../../services/drag.service';

@Component({
  selector: 'app-block-insert',
  standalone: true,
  imports: [],
  templateUrl: './block-insert.component.html',
  styleUrl: './block-insert.component.scss',
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
