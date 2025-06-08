import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoBlockComponent } from './block-todo.component';

describe('TodoBlockComponent', () => {
  let component: TodoBlockComponent;
  let fixture: ComponentFixture<TodoBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
