import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar-block',
  imports: [],
  templateUrl: './toolbar-block.component.html',
  styleUrl: './toolbar-block.component.scss',
})
export class ToolbarBlockComponent {
  @Output() onFormat = new EventEmitter<string>();
  @Output() deleteBalise = new EventEmitter<void>();

  format(command: string) {
    document.execCommand(command, false);
    this.onFormat.emit(command);
  }

  toggleCase() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (!selectedText.trim()) return;

    const hasUppercase = /[A-Z]/.test(selectedText);
    const newText = hasUppercase
      ? selectedText.toLowerCase()
      : selectedText.toUpperCase();

    const textNode = document.createTextNode(newText);

    range.deleteContents();
    range.insertNode(textNode);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartBefore(textNode);
    newRange.setEndAfter(textNode);
    selection.addRange(newRange);

    this.onFormat.emit('toggleCase');
  }
}
