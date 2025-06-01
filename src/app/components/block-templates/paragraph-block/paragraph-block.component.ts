import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent,
} from '@angular/animations';

// Component
import { InsertBlockComponent } from '../../insert-block/insert-block.component';

// Librairie
import interact from 'interactjs';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-paragraph-block',
  imports: [CommonModule, InsertBlockComponent],
  templateUrl: './paragraph-block.component.html',
  styleUrl: './paragraph-block.component.scss',
  animations: [
    trigger('fadeIn', [
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),

      transition('visible => hidden', animate('500ms ease-out')),
      transition('hidden => visible', animate('500ms ease-in')),

      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out'),
      ]),

      transition(':leave', [
        animate(
          '500ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class ParagraphBlockComponent implements AfterViewInit {
  // Variable permettant le déclenchement de la suppresion du composant
  @Output() deleteParagraph = new EventEmitter<void>();

  isVisible = true;

  placeHolder: string = 'Écrivez, tapez « / » pour afficher les commandes…';

  hasContent = false;

  constructor(private layoutService: LayoutService) {}

  ngAfterViewInit(): void {
    const sidebarWidth = this.layoutService.getSidebarWidth();

    interact('.resize-drag')
      .draggable({
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
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            const target = event.target;
            let x = parseFloat(target.getAttribute('data-x')) || 0;
            let y = parseFloat(target.getAttribute('data-y')) || 0;

            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());
          },
        },
        modifiers: [
          interact.modifiers!.restrictSize({
            min: { width: 100, height: 50 },
            max: { width: 500, height: 300 },
          }),
        ],
      });

    const draggableElement = document.querySelector(
      '.editable-paragraph'
    ) as HTMLElement;

    let hoverTimer: any = null;
    let lastPos = { x: 0, y: 0 };
    let mode: 'default' | 'text' | 'grab' = 'default';

    draggableElement.style.cursor = 'grab';

    function setMode(newMode: typeof mode) {
      mode = newMode;
      switch (mode) {
        case 'default':
        case 'grab':
          draggableElement.style.cursor = 'grab';
          break;
        case 'text':
          draggableElement.style.cursor = 'text';
          break;
      }
    }

    draggableElement.addEventListener('mouseenter', (e) => {
      lastPos = { x: e.clientX, y: e.clientY };
      setMode('grab');

      if (hoverTimer) clearTimeout(hoverTimer);

      hoverTimer = setTimeout(() => {
        if (mode === 'grab') {
          setMode('text');
        }
      }, 500);
    });

    draggableElement.addEventListener('mousemove', (e) => {
      const dx = Math.abs(e.clientX - lastPos.x);
      const dy = Math.abs(e.clientY - lastPos.y);

      if (dx + dy > 2) {
        lastPos = { x: e.clientX, y: e.clientY };

        if (mode !== 'text') {
          if (hoverTimer) clearTimeout(hoverTimer);
          hoverTimer = setTimeout(() => {
            setMode('text');
          }, 400);
        }
      }
    });

    draggableElement.addEventListener('mouseleave', () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      setMode('default');
    });

    draggableElement.addEventListener('mousedown', () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      setMode('grab');
    });

    draggableElement.addEventListener('mouseup', () => {
      setMode('grab');
    });
  }

  delete() {
    this.isVisible = false; // déclenche l'animation 'hidden'
  }

  onFadeDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.deleteParagraph.emit();
    }
  }

  onInput(event: Event) {
    const el = event.target as HTMLElement;
    if (el.innerText.trim() === '') {
      el.innerHTML = '';
      this.hasContent = false;
    } else {
      this.hasContent = true;
    }
  }
}
