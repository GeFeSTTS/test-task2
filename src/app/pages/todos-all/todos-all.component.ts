import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';

import { AuthenticationService, RequestsService } from '../../_services';

export interface Element {
  id: number;
  name: string;
  createdAt: string;
  editedAt: string;
}

@Component({
  selector: 'app-todos-all',
  templateUrl: './todos-all.component.html',
  styleUrls: ['./todos-all.component.scss']
})
export class TodosAllComponent implements OnInit {
  private unsubscribe: Subject<any>;
  editAddForm: FormGroup;
  editValue: boolean = false;
  editObject: object;
  displayedColumns;
  dataSource;

  constructor( 
    private api: RequestsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.getTableInfo();

    this.editAddForm = this.formBuilder.group({
      item: ['', Validators.required]
    });
  }

	ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTableInfo() {
    return this.api.getAllTodos()
      .pipe(
        tap(todos => todos),
        takeUntil(this.unsubscribe)
      )
      .subscribe((todos: Array<Element>) => {
        this.dataSource = new MatTableDataSource(todos);
        this.displayedColumns = ['id', 'name', 'createdAt', 'editedAt', 'actions'];
      });
  }

  get f() { return this.editAddForm.controls; }

  addNewItem() {
    if (this.editAddForm.invalid) {
      return;
    }

    const body = {
      name: this.f.item.value,
      createdAt: new Date(),
      editedAt: new Date()
    };

    this.api.addNewTodo(body)
    .pipe(
      tap(todos => todos),
      takeUntil(this.unsubscribe)
    )
    .subscribe(() => this.getTableInfo());

    // Clear form
    this.editAddForm.reset();
  }

  editItem(item, event) {
    event.stopPropagation();
    this.editValue = true;
    this.editObject = item;
    this.f['item'].setValue(item.name);
  }

  saveEditedItem() {
    if (this.editAddForm.invalid) {
      return;
    }

    const body = {
      ...this.editObject,
      name: this.f.item.value,
      editedAt: new Date()
    };

    this.api.editTodo(body)
    .pipe(
      tap(todos => todos),
      takeUntil(this.unsubscribe)
    )
    .subscribe(() => this.getTableInfo());

    this.editValue = false;
    // Clear form
    this.editAddForm.reset();
  }

  cancelEdit() {
    this.editValue = false;
    this.editAddForm.reset();
  }

  deleteItem(id, event) {
    event.stopPropagation();
    this.api.deleteTodo(id)
    .pipe(
      tap(todos => todos),
      takeUntil(this.unsubscribe)
    )
    .subscribe(() => this.getTableInfo());
  }

  redirect(id) {
    this.router.navigate([`/todo/${id}`]);
  }

  logout() {
    this.authenticationService.logout();
  }

}
