// Angular
import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent {
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {}

  toggleTheme() {
    // Change theme and notify
    this.themeService.toggleTheme();
  }
}
