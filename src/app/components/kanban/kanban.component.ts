// Angular
import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent {
  backlog = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  development = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog',
  ];

  inProgress = ['inProgress', 'PinProgress', 'inProgresse', 'inProgressep'];

  done = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  ngAfterViewInit(): void {
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach((el) => {
      el.setAttribute('spellcheck', 'false');
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  isJumping = false;

  startJumpAnimation() {
    if (!this.isJumping) {
      this.isJumping = true;
    }
  }

  onAnimationEnd() {
    this.isJumping = false;
  }
}
