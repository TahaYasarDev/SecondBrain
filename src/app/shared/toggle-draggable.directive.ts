// Angular
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appToggleDraggable]',
  standalone: true,
})
export class ToggleDraggableDirective {
  private paragraph = inject(ElementRef) as ElementRef<HTMLElement>;

  private get wrapper(): HTMLElement | null {
    return this.paragraph.nativeElement.closest('.draggable-wrapper');
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.wrapper?.classList.remove('draggable');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.wrapper?.classList.add('draggable');
  }
}
