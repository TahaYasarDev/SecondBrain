export class Ticket {
  jira: string;
  title: string;
  texte: string;
  estimate?: number | null;
  timeSpent?: number | null;
  progress?: number | null;

  constructor(
    jira: string,
    title: string,
    texte: string,
    estimate?: number | null,
    timeSpent?: number | null,
    progress?: number | null
  ) {
    this.jira = jira;
    this.title = title;
    this.texte = texte;
    this.estimate = estimate ?? null;
    this.timeSpent = timeSpent ?? null;
    this.progress = progress ?? null;
  }
}
