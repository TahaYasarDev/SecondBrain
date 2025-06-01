// Angular
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Component
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';
import { InsertBlockComponent } from '../../insert-block/insert-block.component';

// Service
import { DragService } from '../../../services/drag.service';

// Shared
import { fadeInAnimation } from '../../../shared/animation';
import { BaseUiBehavior } from '../../../shared/base-ui-behavior';

@Component({
  selector: 'app-paragraph-block',
  standalone: true,
  imports: [CommonModule, ToolbarBlockComponent, InsertBlockComponent],
  templateUrl: './paragraph-block.component.html',
  styleUrl: './paragraph-block.component.scss',
  animations: [fadeInAnimation],
})
export class ParagraphBlockComponent
  extends BaseUiBehavior
  implements AfterViewInit
{
  placeHolder: string = 'Écrivez, tapez « / » pour afficher les commandes…';
  hasContent = false;

  interactable: any;
  enableResizeDrag = true;
  releaseTimeout: any = null;
  resetTimeout: any = null;

  constructor(private dragService: DragService) {
    super();
  }

  @ViewChild('draggableWrapper') draggableWrapper!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    // drag
    this.interactable = this.dragService.initDraggable('.draggable');

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

  reenableResizeDrag(wrapper: HTMLElement) {
    if (!this.enableResizeDrag) {
      wrapper.classList.add('resize-drag');
      this.enableResizeDrag = true;
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
