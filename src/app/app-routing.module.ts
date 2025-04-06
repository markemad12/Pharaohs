import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateComponent } from './post/create/create.component';
import { ViewComponent } from './post/view/view.component';
import { EditComponent } from './post/edit/edit.component';
import { NotesComponent } from './post/notes/notes.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';
import { NotFoundComponent } from './notfound/notfound.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent,canActivate:[LoginGuard] },
  { path: 'register', component: RegisterComponent },
  {
    path:'post/notes',component:NotesComponent,canActivate:[AuthGuard]
  },
  {
    path:'post/create', component:CreateComponent
  },
  {
    path:'post/:id/view', component:ViewComponent
  },
  {
    path:'post/:id/edit', component:EditComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }