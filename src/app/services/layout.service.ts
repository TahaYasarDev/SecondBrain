import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private sidebarWidth = 0;

  setSidebarWidth(width: number) {
    this.sidebarWidth = width;
  }

  getSidebarWidth(): number {
    return this.sidebarWidth;
  }
}
