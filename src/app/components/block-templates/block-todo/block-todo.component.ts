// Angular
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

// Component
import { BlockToolbarComponent } from '../block-toolbar/block-toolbar.component';

// Shared
import { fadeAnimation } from '../../../shared/animation';
import { ToggleDraggableDirective } from '../../../shared/toggle-draggable.directive';
import { BaseToolbarBehavior } from '../../../shared/base-toolbar-behavior';

@Component({
  selector: 'app-block-todo',
  standalone: true,
  imports: [
    ToggleDraggableDirective,
    FormsModule,
    CommonModule,
    DragDropModule,
    BlockToolbarComponent,
  ],
  templateUrl: './block-todo.component.html',
  styleUrl: './block-todo.component.scss',
  animations: [fadeAnimation],
})
export class BlockTodoComponent extends BaseToolbarBehavior {
  informations: string = 'Aucune tâche pour le moment. 🎯';
  tasks: Task[] = [];
  newTask: string = '';

  get doneTasks(): Task[] {
    return this.tasks.filter((t) => t.done);
  }

  get todoTasks(): Task[] {
    return this.tasks.filter((t) => !t.done);
  }

  get hasTasks(): boolean {
    return this.todoTasks.length > 0 || this.doneTasks.length > 0;
  }

  addTask() {
    const label = this.newTask.trim();
    if (label) {
      this.tasks.push({ label, done: false });
      this.newTask = '';
    }
  }

  deleteTask(task: Task) {
    const index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}

interface Task {
  label: string;
  done: boolean;
}
