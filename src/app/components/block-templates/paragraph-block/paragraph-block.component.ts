import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
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
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';

@Component({
  selector: 'app-paragraph-block',
  imports: [CommonModule, InsertBlockComponent, ToolbarBlockComponent],
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
  @Output() deleteBalise = new EventEmitter<void>();

  isVisible = true;
  placeHolder: string = 'Écrivez, tapez « / » pour afficher les commandes…';
  hasContent = false;

  interactable: any;
  enableResizeDrag = true;
  releaseTimeout: any = null;
  resetTimeout: any = null;

  constructor(private layoutService: LayoutService) {}

  @ViewChild('draggableWrapper') draggableWrapper!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    const sidebarWidth = this.layoutService.getSidebarWidth();
    //#region interact
    this.interactable = interact('.draggable ').draggable({
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
          if (!this.enableResizeDrag) return; // bloquer drag si disabled
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x.toString());
          target.setAttribute('data-y', y.toString());
        },
      },
    });
    //#endregion

    //#region cursor handle
    const editableParagraph = document.querySelector(
      '.editable-paragraph'
    ) as HTMLElement;

    let hoverTimer: any = null;
    let lastPos = { x: 0, y: 0 };
    let mode: 'default' | 'text' | 'all-scroll' = 'default';

    editableParagraph.style.cursor = 'all-scroll';

    const setMode = (newMode: typeof mode) => {
      mode = newMode;
      switch (mode) {
        case 'default':
        case 'all-scroll':
          editableParagraph.style.cursor = 'all-scroll';
          break;
        case 'text':
          editableParagraph.style.cursor = 'text';
          break;
      }
    };

    editableParagraph.addEventListener('mouseenter', (e) => {
      lastPos = { x: e.clientX, y: e.clientY };
      setMode('all-scroll');

      if (hoverTimer) clearTimeout(hoverTimer);

      hoverTimer = setTimeout(() => {
        if (this.hasContent && e.button === 0) setMode('text');
        else if (mode === 'all-scroll') setMode('text');
      }, 250);
    });

    editableParagraph.addEventListener('mousemove', (e) => {
      const dx = Math.abs(e.clientX - lastPos.x);
      const dy = Math.abs(e.clientY - lastPos.y);
      if (dx + dy > 2) {
        lastPos = { x: e.clientX, y: e.clientY };
        if (mode !== 'text') {
          if (hoverTimer) clearTimeout(hoverTimer);
          hoverTimer = setTimeout(() => setMode('text'), 400);
        }
      }
    });

    editableParagraph.addEventListener('mouseleave', () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      setMode('default');
    });

    //#endregion

    //#region formatting
    const wrapper = this.draggableWrapper.nativeElement;

    editableParagraph.addEventListener('mousedown', (e) => {
      if (hoverTimer) clearTimeout(hoverTimer);
      setMode('all-scroll');

      // Si y'a du contenu et clic gauche maintenu, on désactive resize/drag
      if (this.hasContent && e.button === 0) {
        setMode('text');
        // Suppression classe resize-drag pour désactiver interact
        if (wrapper.classList.contains('resize-drag')) {
          wrapper.classList.remove('resize-drag');
          this.enableResizeDrag = false;
        }
      }
    });

    editableParagraph.addEventListener('mouseup', () => {
      setMode('text');

      // Remise en place de resize-drag après délai si désactivé
      if (!this.enableResizeDrag) {
        if (this.resetTimeout) clearTimeout(this.resetTimeout);

        this.resetTimeout = setTimeout(() => {
          this.reenableResizeDrag(wrapper);
        }, 1000);
      }
    });
    //#endregion
  }

  toggleCase() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (!selectedText.trim()) return;

    const hasUppercase = /[A-Z]/.test(selectedText);
    const newText = hasUppercase
      ? selectedText.toLowerCase()
      : selectedText.toUpperCase();

    const textNode = document.createTextNode(newText);

    range.deleteContents();
    range.insertNode(textNode);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartBefore(textNode);
    newRange.setEndAfter(textNode);
    selection.addRange(newRange);
  }

  reenableResizeDrag(wrapper: HTMLElement) {
    if (!this.enableResizeDrag) {
      wrapper.classList.add('resize-drag');
      this.enableResizeDrag = true;
    }
  }

  delete() {
    this.isVisible = false; // déclenche l'animation 'hidden'
  }

  onFadeDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.deleteBalise.emit();
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

  onTextFormatted(command: string) {
    // Tu peux ajouter une logique si tu veux faire quelque chose de spécifique selon la commande
    if (!this.enableResizeDrag) {
      if (this.resetTimeout) clearTimeout(this.resetTimeout);
      this.resetTimeout = setTimeout(() => {
        this.reenableResizeDrag(this.draggableWrapper.nativeElement);
      }, 1500);
    }
  }
}
