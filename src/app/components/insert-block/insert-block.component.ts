import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';

//
import interact from 'interactjs';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-insert-block',
  imports: [],
  templateUrl: './insert-block.component.html',
  styleUrl: './insert-block.component.scss',
})
export class InsertBlockComponent implements AfterViewInit {
  @Output() baliseSelected = new EventEmitter<string>();

  constructor(private layoutService: LayoutService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const sidebarWidth = this.layoutService.getSidebarWidth();

      interact('.draggable').draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: {
              top: 0,
              left: 300,
              right: window.innerWidth,
              bottom: window.innerHeight,
            },
            endOnly: true,
          }),
        ],
        listeners: {
          move(event) {
            const target = event.target;
            const x =
              (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y =
              (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());
          },
        },
      });
    }, 50);
  }

  onBaliseSelected(balise: string) {
    this.baliseSelected.emit(balise);
  }
}
