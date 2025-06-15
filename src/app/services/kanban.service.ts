// Model
import { Column } from '../models/column';

export class KanbanService {
  // shared storage between all instances, keyed by Kanban ID
  private static kanbansData: { [kanbanId: string]: Column[] } = {};

  private columns: Column[] = [];
  private kanbanId: string;

  constructor(kanbanId: string) {
    this.kanbanId = kanbanId;

    // if the Kanban ID already exists, load its columns
    if (KanbanService.kanbansData[kanbanId]) {
      this.columns = KanbanService.kanbansData[kanbanId];
    } else {
      // otherwise, create an empty array of columns for this Kanban ID
      KanbanService.kanbansData[kanbanId] = [];
      this.columns = KanbanService.kanbansData[kanbanId];
    }
  }

  // Returns the list of columns for this Kanban
  getColumns(): Column[] {
    return this.columns;
  }

  // Adds a new column with the given title to this Kanban
  addColumn(title: string): void {
    const newColumn: Column = { title, items: [] };
    this.columns.push(newColumn);
  }

  // Renames a column at the specified index
  renameColumn(index: number, newTitle: string): void {
    if (this.columns[index]) {
      this.columns[index].title = newTitle;
    }
  }

  // Deletes a column at the given index, moving its items to an adjacent column if needed
  deleteColumn(index: number): void {
    if (!this.columns[index]) return;

    const removedColumn = this.columns[index];

    // if the deleted column contains items, move them to a neighbor column
    if (removedColumn.items?.length > 0) {
      if (index > 0) {
        this.columns[index - 1].items.push(...removedColumn.items);
      } else if (this.columns.length > 1) {
        this.columns[index + 1].items.push(...removedColumn.items);
      }
    }

    // remove the column from the list
    this.columns.splice(index, 1);
  }

  // Replace the columns entirely and update the shared storage
  updateColumns(columns: Column[]): void {
    this.columns = columns;
    KanbanService.kanbansData[this.kanbanId] = columns;
  }
}
