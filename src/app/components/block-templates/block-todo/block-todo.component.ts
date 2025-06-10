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
import { CountService } from '../../../services/count.service';

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
  componentId: string = '';

  constructor(private countService: CountService) {
    super();
  }

  ngOnInit() {
    this.countService.incrementTag('task');
    this.componentId = 'todo-' + Math.random().toString(36);
  }

  ngOnDestroy() {
    this.countService.decrementTag('task');
    this.countService.removeTaskComponent(this.componentId);
  }

  get doneTasks(): Task[] {
    return this.tasks.filter((t) => t.done);
  }

  get todoTasks(): Task[] {
    return this.tasks.filter((t) => !t.done);
  }

  get hasTasks(): boolean {
    return this.todoTasks.length > 0 || this.doneTasks.length > 0;
  }

  updateTaskCounts() {
    const todo = this.todoTasks.length;
    const done = this.doneTasks.length;
    this.countService.updateComponentTaskCounts(this.componentId, todo, done);
  }

  addTask() {
    const label = this.newTask.trim();
    if (label) {
      this.tasks.push({ label, done: false });
      this.newTask = '';
      this.updateTaskCounts();
    }
  }

  deleteTask(task: Task) {
    const index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
      this.updateTaskCounts();
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
