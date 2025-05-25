import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NoteComponent } from './note/note.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NoteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SecondBrain';
}
