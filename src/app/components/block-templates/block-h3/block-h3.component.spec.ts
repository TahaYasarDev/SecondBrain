import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockH3Component } from './block-h3.component';

describe('BlockH3Component', () => {
  let component: BlockH3Component;
  let fixture: ComponentFixture<BlockH3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockH3Component],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockH3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
