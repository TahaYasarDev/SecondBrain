import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H2BlockComponent } from './block-h2.component';

describe('H2BlockComponent', () => {
  let component: H2BlockComponent;
  let fixture: ComponentFixture<H2BlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [H2BlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(H2BlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
