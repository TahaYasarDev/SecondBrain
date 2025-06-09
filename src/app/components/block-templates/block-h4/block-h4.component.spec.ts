import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockH4Component } from './block-h4.component';

describe('BlockH4Component', () => {
  let component: BlockH4Component;
  let fixture: ComponentFixture<BlockH4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockH4Component],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockH4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
