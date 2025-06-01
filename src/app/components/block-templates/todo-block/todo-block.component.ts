import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <- importer CommonModule
import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationEvent,
} from '@angular/animations';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ToolbarBlockComponent } from '../toolbar-block/toolbar-block.component';
import { fadeInAnimation } from '../../../shared/animation';

@Component({
  selector: 'app-todo-block',
  imports: [
    FormsModule,
    CommonModule,
    CdkDropList,
    CdkDrag,
    ToolbarBlockComponent,
  ],
  templateUrl: './todo-block.component.html',
  styleUrl: './todo-block.component.scss',
  animations: [fadeInAnimation],
})
export class TodoBlockComponent {
  isVisible = true;

  @Output() deleteBalise = new EventEmitter<void>();

  onFadeDone(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.deleteBalise.emit();
    }
  }

  delete() {
    this.isVisible = false; // déclenche l'animation 'hidden'
  }

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
