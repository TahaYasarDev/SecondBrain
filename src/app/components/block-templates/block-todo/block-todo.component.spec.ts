import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTodoComponent } from './block-todo.component';

describe('BlockTodoComponent', () => {
  let component: BlockTodoComponent;
  let fixture: ComponentFixture<BlockTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockTodoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
