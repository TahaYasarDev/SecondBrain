// Angular
import { BaseUiBehavior } from './base-ui-behavior';

export abstract class BaseToolbarBehavior extends BaseUiBehavior {
  showToolbar = true;
  isFocused = false;
  isHovered = false;

  onFocus(): void {
    this.isFocused = true;
    this.showToolbar = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.updateToolbarVisibility();
  }

  onMouseEnter(): void {
    this.isHovered = true;
    this.showToolbar = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
    this.updateToolbarVisibility();
  }

  protected updateToolbarVisibility(): void {
    if (this.hasContent && !this.isFocused && !this.isHovered) {
      this.showToolbar = false;
    }
  }
}
