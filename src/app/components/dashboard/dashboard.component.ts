// Angular
import { Component } from '@angular/core';

// Shared
import { fadeAnimation } from '../../shared/animation';
import { BaseUiBehavior } from '../../shared/base-ui-behavior';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [fadeAnimation],
})
export class DashboardComponent extends BaseUiBehavior {}
