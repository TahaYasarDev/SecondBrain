// Angular
import { Injectable } from '@angular/core';
import interact from 'interactjs';

// Service
import { LayoutService } from './layout.service';

@Injectable({
  providedIn: 'root',
})
export class DragService {
  enableResizeDrag = true;

  constructor(private layoutService: LayoutService) {}

  initDraggable(selector: string) {
    const sidebarWidth = this.layoutService.getSidebarWidth();

    return interact(selector).draggable({
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: {
            top: 0,
            left: sidebarWidth,
            right: window.innerWidth,
            bottom: window.innerHeight,
          },
          endOnly: true,
        }),
      ],
      listeners: {
        move: (event) => {
          if (!this.enableResizeDrag) return;
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x.toString());
          target.setAttribute('data-y', y.toString());
        },
      },
    });
  }

  setEnableResizeDrag(value: boolean) {
    this.enableResizeDrag = value;
  }

  getEnableResizeDrag() {
    return this.enableResizeDrag;
  }
}
