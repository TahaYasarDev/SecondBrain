import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockInsertComponent } from './block-insert.component';

describe('BlockInsertComponent', () => {
  let component: BlockInsertComponent;
  let fixture: ComponentFixture<BlockInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockInsertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
