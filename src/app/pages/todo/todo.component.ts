import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthenticationService, RequestsService } from '../../_services';

import { ConfirmationDialogComponent } from '../../_components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  private unsubscribe: Subject<any>;

  currentTodo = {
    id: null,
    name: '',
    description: '',
    editedAt: '',
    createdAt: ''
  };
  editForm: FormGroup;
  chosenToEdit = false;

  constructor(
    private api: RequestsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) {
    this.unsubscribe = new Subject();
   }

  ngOnInit(): void {
    const id = this.currentRoute.snapshot.paramMap.get('id');
    this.getCurrentTodoInfo(id);

    this.editForm = this.formBuilder.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.required
      ])]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getCurrentTodoInfo(id) {
    return this.api.getChosenTodo(id)
      .pipe(
        tap(todos => todos),
        takeUntil(this.unsubscribe)
      )
      .subscribe((todo: any) => this.currentTodo = todo);
  }

  get f() { return this.editForm.controls; }

  editItem() {
    this.chosenToEdit = true;
    this.f['description'].setValue(this.currentTodo.description);
  }

  saveEditedItem() {
    if (this.editForm.invalid) {
      return;
    }

    const body = {
      ...this.currentTodo,
      description: this.f.description.value,
      editedAt: new Date()
    };

    this.api.editTodo(body)
    .pipe(
      tap(todo => todo),
      takeUntil(this.unsubscribe)
    )
    .subscribe(() => this.getCurrentTodoInfo(this.currentTodo.id));

    this.chosenToEdit = false;
    // Clear form
    this.editForm.reset();
  }

  deleteItem() {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete TODO',
        message: `Are you sure, you want to remove TODO: '${this.currentTodo.name}'`
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.api.deleteTodo(this.currentTodo.id)
        .pipe(
          tap(todo => todo),
          takeUntil(this.unsubscribe)
        )
        .subscribe();
        return this.router.navigate(['']);
      }
    });
  }

  cancelEdit() {
    this.chosenToEdit = false;
    this.editForm.reset();
  }

  logout() {
    this.authenticationService.logout();
  }
}
