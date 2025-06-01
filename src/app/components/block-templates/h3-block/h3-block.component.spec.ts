import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H3BlockComponent } from './h3-block.component';

describe('H3BlockComponent', () => {
  let component: H3BlockComponent;
  let fixture: ComponentFixture<H3BlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [H3BlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(H3BlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
