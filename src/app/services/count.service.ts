// Angular
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CountService {
  private componentTasks: { [key: string]: { todo: number; done: number } } =
    {};

  tags: Tags = {
    H1: 0,
    H2: 0,
    H3: 0,
    H4: 0,
    paragraph: 0,
    task: 0,
  };

  tasks: Tasks = {
    taskTodo: 0,
    taskDone: 0,
  };

  // TAG
  incrementTag(type: keyof Tags) {
    this.tags[type]++;
  }

  decrementTag(type: keyof Tags) {
    if (this.tags[type] > 0) {
      this.tags[type]--;
    }
  }

  getTag(type: keyof Tags): number {
    return this.tags[type];
  }

  getAllTags(): Tags {
    return this.tags;
  }

  // TASKS
  updateComponentTaskCounts(
    componentId: string,
    todoCount: number,
    doneCount: number
  ) {
    this.componentTasks[componentId] = { todo: todoCount, done: doneCount };
    this.calculateTotalTasks();
  }

  private calculateTotalTasks() {
    let totalTodo = 0;
    let totalDone = 0;

    for (const key in this.componentTasks) {
      totalTodo += this.componentTasks[key].todo;
      totalDone += this.componentTasks[key].done;
    }
    this.tasks.taskTodo = totalTodo;
    this.tasks.taskDone = totalDone;
  }

  getAllTasks(): Tasks {
    return this.tasks;
  }

  removeTaskComponent(componentId: string) {
    delete this.componentTasks[componentId];
    this.calculateTotalTasks();
  }
}

interface Tags {
  H1: number;
  H2: number;
  H3: number;
  H4: number;
  paragraph: number;
  task: number;
}

interface Tasks {
  taskTodo: number;
  taskDone: number;
}
