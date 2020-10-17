import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosAllComponent } from './todos-all.component';

describe('TodosAllComponent', () => {
  let component: TodosAllComponent;
  let fixture: ComponentFixture<TodosAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodosAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
