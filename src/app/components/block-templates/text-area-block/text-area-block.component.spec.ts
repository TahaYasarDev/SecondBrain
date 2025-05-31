import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaBlockComponent } from './text-area-block.component';

describe('TextAreaBlockComponent', () => {
  let component: TextAreaBlockComponent;
  let fixture: ComponentFixture<TextAreaBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAreaBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAreaBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
