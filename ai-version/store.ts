import type { Task, TaskStats } from './types.js';

export const initialTasks: readonly Task[] = [
  { id: 1, title: 'Complete Assignment 1', done: false },
  { id: 2, title: 'Complete Assignment 2', done: false },
  { id: 3, title: 'Complete Assignment 3', done: false }
];

export class TaskStore {
  private tasks: Task[] = [];
  private nextId = 1;

  constructor() {
    this.reset();
  }

  public reset(): Task[] {
    this.tasks = initialTasks.map((t) => ({ ...t }));
    const maxId = this.tasks.reduce((max, t) => Math.max(max, t.id), 0);
    this.nextId = maxId + 1;
    return this.getAll();
  }

  public getAll(filter?: { search?: string | undefined; done?: boolean | undefined }): Task[] {
    let result = [...this.tasks];

    if (filter?.search !== undefined && filter.search.trim() !== '') {
      const searchLower = filter.search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(searchLower));
    }

    if (filter?.done !== undefined) {
      result = result.filter((t) => t.done === filter.done);
    }

    return result.map((t) => ({ ...t }));
  }

  public getById(id: number): Task | undefined {
    const task = this.tasks.find((t) => t.id === id);
    return task ? { ...task } : undefined;
  }

  public create(title: string): Task {
    const newTask: Task = {
      id: this.nextId++,
      title,
      done: false
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  public update(
    id: number,
    updates: { title?: string | undefined; done?: boolean | undefined }
  ): Task | null {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return null;
    }
    const current = this.tasks[taskIndex];
    if (!current) {
      return null;
    }

    if (updates.title !== undefined) {
      current.title = updates.title;
    }
    if (updates.done !== undefined) {
      current.done = updates.done;
    }

    return { ...current };
  }

  public delete(id: number): boolean {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return false;
    }
    this.tasks.splice(taskIndex, 1);
    return true;
  }

  public getStats(): TaskStats {
    const total = this.tasks.length;
    const done = this.tasks.filter((t) => t.done).length;
    const open = this.tasks.filter((t) => !t.done).length;
    return { total, done, open };
  }
}

export const taskStore = new TaskStore();
