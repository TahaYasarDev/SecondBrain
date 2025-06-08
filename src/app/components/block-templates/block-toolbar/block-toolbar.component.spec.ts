import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarBlockComponent } from './block-toolbar.component';

describe('ToolbarBlockComponent', () => {
  let component: ToolbarBlockComponent;
  let fixture: ComponentFixture<ToolbarBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
