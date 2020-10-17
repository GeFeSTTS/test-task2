import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { TodosAllComponent } from './pages/todos-all/todos-all.component';
import { AuthGuard } from './_helpers';

const routes: Routes = [
  { path: 'login', component: SigninComponent },
  { path: '', component: TodosAllComponent, canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
