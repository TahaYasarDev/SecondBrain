import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Component
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NoteComponent } from './components/note/note.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NoteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SecondBrain';
}
