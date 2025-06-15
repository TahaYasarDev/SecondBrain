export class Ticket {
  ticket: string;
  title: string;
  texte: string;
  estimate?: number | null;
  timeSpent?: number | null;
  progress?: number | null;

  constructor(
    ticket: string,
    title: string,
    texte: string,
    estimate?: number | null,
    timeSpent?: number | null,
    progress?: number | null
  ) {
    this.ticket = ticket;
    this.title = title;
    this.texte = texte;
    this.estimate = estimate ?? null;
    this.timeSpent = timeSpent ?? null;
    this.progress = progress ?? null;
  }
}
