// Angular
import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CdkDropList, CdkDrag, NgIf, NgFor, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent {
  backlog: Item[] = [];
  development: Item[] = [];
  inProgress: Item[] = [];
  done: Item[] = [];

  ngAfterViewInit(): void {
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach((el) => {
      el.setAttribute('spellcheck', 'false');
    });
  }

  drop(event: CdkDragDrop<Item[]>) {
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

  showPopup = false;

  lines: string[] = ['', '', '', ''];

  handleClick() {
    this.showPopup = true;
    this.lines = ['', '', '', ''];
  }
  newTask: Item = {
    jira: '',
    title: '',
    texte: '',
    estimate: 1,
    progress: 0,
  };

  addTask() {
    if (this.newTask.title.trim() === '') {
      alert('Title is required');
      return;
    }
    this.backlog.push({ ...this.newTask }); // on push une copie
    this.showPopup = false;
  }

  trackByFn(index: number, item: Item): string {
    return item.jira;
  }
}

interface Item {
  jira: string;
  title: string;
  texte: string;
  estimate: number;
  progress: number;
}
