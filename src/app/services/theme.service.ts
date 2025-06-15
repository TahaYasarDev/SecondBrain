// Angular
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // dark theme by default
  private isDarkThemeSubject = new BehaviorSubject<boolean>(true);

  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  toggleTheme() {
    const newTheme = !this.isDarkThemeSubject.value;
    // send new theme
    this.isDarkThemeSubject.next(newTheme);

    const body = document.body;
    if (newTheme) {
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
    }
  }

  get currentTheme(): boolean {
    return this.isDarkThemeSubject.value;
  }

  // updates all website icons based on the current theme (dark or light)
  updateIcons(isDark: boolean) {
    const icons = document.querySelectorAll('img.icon');
    icons.forEach((img) => {
      const src = img.getAttribute('src');
      if (!src) return;
      const hasLight = src.includes('-light');

      if (!isDark && !hasLight) {
        const newSrc = src.replace(/(\.png|\.svg|\.jpg|\.webp)$/, '-light$1');
        img.setAttribute('src', newSrc);
      } else if (isDark && hasLight) {
        const newSrc = src.replace('-light', '');
        img.setAttribute('src', newSrc);
      }
    });
  }

  // watches for DOM changes and updates icons dynamically to match the current theme
  observeIconChanges() {
    const observer = new MutationObserver(() => {
      this.updateIcons(this.currentTheme);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}
