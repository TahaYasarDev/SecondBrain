import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H4BlockComponent } from './block-h4.component';

describe('H4BlockComponent', () => {
  let component: H4BlockComponent;
  let fixture: ComponentFixture<H4BlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [H4BlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(H4BlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
