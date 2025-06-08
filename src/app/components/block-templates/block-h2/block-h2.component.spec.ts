import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockH2Component } from './block-h2.component';

describe('BlockH2Component', () => {
  let component: BlockH2Component;
  let fixture: ComponentFixture<BlockH2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockH2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockH2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
