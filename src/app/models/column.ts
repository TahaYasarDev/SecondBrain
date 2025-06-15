// Model
import { Ticket } from './ticket.model';

export class Column {
  title: string;
  items: Ticket[];
  isTitleCustom?: boolean;

  constructor(title: string, items: Ticket[], isTitleCustom: boolean = false) {
    this.title = title;
    this.items = items;
    this.isTitleCustom = isTitleCustom ?? false;
  }
}
