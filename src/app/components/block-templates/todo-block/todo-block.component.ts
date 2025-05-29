import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <- importer CommonModule

import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-todo-block',
  imports: [FormsModule, CommonModule, CdkDropList, CdkDrag],
  templateUrl: './todo-block.component.html',
  styleUrl: './todo-block.component.scss',
})
export class TodoBlockComponent {
  onInput(event: Event) {
    const el = event.target as HTMLElement;
    if (el.innerText.trim() === '') {
      el.innerHTML = ''; // force le vrai "vide"
    }
  }

  tasks: Task[] = [];
  newTask: string = '';

  get doneTasks(): Task[] {
    return this.tasks.filter((t) => t.done);
  }

  get todoTasks(): Task[] {
    return this.tasks.filter((t) => !t.done);
  }

  addTask() {
    const label = this.newTask.trim();
    if (label) {
      this.tasks.push({ label, done: false });
      this.newTask = '';
    }
  }

  deleteTask(i: number) {
    this.tasks.splice(i, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}

interface Task {
  label: string;
  done: boolean;
}
