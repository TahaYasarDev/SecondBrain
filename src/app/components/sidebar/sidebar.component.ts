// Angular
import { Component, ElementRef } from '@angular/core';

// Service
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private layoutService: LayoutService, private el: ElementRef) {}

  ngAfterViewInit() {
    const width = this.el.nativeElement.offsetWidth;
    this.layoutService.setSidebarWidth(width);
  }

  addNote() {}
}
