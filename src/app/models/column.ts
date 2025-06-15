// Model
import { Ticket } from './ticket.model';

export class Column {
  title: string;
  items: Ticket[];

  constructor(title: string, items: Ticket[]) {
    this.title = title;
    this.items = items;
  }
}
