// Angular
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Component
import { BlockToolbarComponent } from '../block-toolbar/block-toolbar.component';
import { BlockInsertComponent } from '../block-insert/block-insert.component';

// Service
import { DragService } from '../../../services/drag.service';
import { CountService } from '../../../services/count.service';

// Shared
import { fadeAnimation } from '../../../shared/animation';
import { ToggleDraggableDirective } from '../../../shared/toggle-draggable.directive';
import { BaseToolbarBehavior } from '../../../shared/base-toolbar-behavior';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-block-paragraph',
  standalone: true,
  imports: [
    ToggleDraggableDirective,
    CommonModule,
    TranslateModule,
    BlockToolbarComponent,
    BlockInsertComponent,
  ],
  templateUrl: './block-paragraph.component.html',
  styleUrl: './block-paragraph.component.scss',
  animations: [fadeAnimation],
})
export class BlockParagraphComponent
  extends BaseToolbarBehavior
  implements AfterViewInit
{
  constructor(
    private dragService: DragService,
    private countService: CountService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.dragService.initDraggable('.draggable');
  }

  ngOnInit() {
    this.countService.incrementTag('paragraph');
  }

  ngOnDestroy() {
    this.countService.decrementTag('paragraph');
  }
}
