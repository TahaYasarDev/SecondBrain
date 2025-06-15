// Angular
import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Component
import { BlockToolbarComponent } from '../block-toolbar/block-toolbar.component';

// Service
import { DragService } from '../../../services/drag.service';
import { CountService } from '../../../services/count.service';

// Shared
import { fadeAnimation } from '../../../shared/animation';
import { ToggleDraggableDirective } from '../../../shared/toggle-draggable.directive';
import { BaseToolbarBehavior } from '../../../shared/base-toolbar-behavior';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-block-h1',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ToggleDraggableDirective,
    BlockToolbarComponent,
  ],
  templateUrl: './block-h1.component.html',
  styleUrl: './block-h1.component.scss',
  animations: [fadeAnimation],
})
export class BlockH1Component
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
    this.countService.incrementTag('H1');
  }

  ngOnDestroy() {
    this.countService.decrementTag('H1');
  }
}
