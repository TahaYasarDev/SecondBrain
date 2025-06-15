// Angular
import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  HostListener,
} from '@angular/core';

// Service
import { DragService } from '../../../services/drag.service';

@Component({
  selector: 'app-block-insert',
  standalone: true,
  imports: [],
  templateUrl: './block-insert.component.html',
  styleUrl: './block-insert.component.scss',
})
export class BlockInsertComponent implements AfterViewInit {
  @Output() baliseSelected = new EventEmitter<string>();
  dropdownOpen = false;
  isDesktop = window.innerWidth > 1024;

  constructor(private dragService: DragService) {}

  ngAfterViewInit(): void {
    this.dragService.initDraggable('.draggable');
  }

  onBaliseSelected(balise: string) {
    this.baliseSelected.emit(balise);
  }

  toggleDropdown() {
    if (!this.isDesktop) {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth > 1024;
    if (this.isDesktop) {
      this.dropdownOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // check if the click occurred outside the .dropdown element
    if (!target.closest('.dropdown')) {
      this.dropdownOpen = false;
    }
  }
}
