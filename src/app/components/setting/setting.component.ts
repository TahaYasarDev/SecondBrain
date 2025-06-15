// Angular
import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

//Shared
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent {
  isDarkTheme = false;

  constructor(
    private themeService: ThemeService,
    private translate: TranslateService
  ) {}

  changeLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.translate.use(target.value);
    }
  }

  toggleTheme() {
    // Change theme and notify
    this.themeService.toggleTheme();
  }
}
