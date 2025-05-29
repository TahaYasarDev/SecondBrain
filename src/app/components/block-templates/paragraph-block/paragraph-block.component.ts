import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
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
  imports: [InsertBlockComponent],
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

  data: string = '<strong>TEST</strong>';

  constructor(private layoutService: LayoutService, private el: ElementRef) {}

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

            // resize the element
            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            // move it if needed
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
    } else {
      this.data = el.innerText;
    }
  }
}
