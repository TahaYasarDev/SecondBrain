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
  selector: 'app-block-h3',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ToggleDraggableDirective,
    BlockToolbarComponent,
  ],
  templateUrl: './block-h3.component.html',
  styleUrl: './block-h3.component.scss',
  animations: [fadeAnimation],
})
export class BlockH3Component
  extends BaseToolbarBehavior
  implements AfterViewInit
{
  interactable: any;

  constructor(
    private dragService: DragService,
    private countService: CountService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.interactable = this.dragService.initDraggable('.draggable');
  }

  ngOnInit() {
    this.countService.incrementTag('H3');
  }

  ngOnDestroy() {
    this.countService.decrementTag('H3');
  }
}
