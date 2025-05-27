import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H1BlockComponent } from './h1-block.component';

describe('H1BlockComponent', () => {
  let component: H1BlockComponent;
  let fixture: ComponentFixture<H1BlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [H1BlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(H1BlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
