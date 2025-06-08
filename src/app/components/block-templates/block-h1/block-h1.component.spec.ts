import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockH1Component } from './block-h1.component';

describe('BlockH1Component', () => {
  let component: BlockH1Component;
  let fixture: ComponentFixture<BlockH1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockH1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockH1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
