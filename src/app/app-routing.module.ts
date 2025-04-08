import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './post/create/create.component';
import { ViewComponent } from './post/view/view.component';
import { EditComponent } from './post/edit/edit.component';
import { NotesComponent } from './post/notes/notes.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';


const routes: Routes = [
  {
    path:'', loadChildren:() => import('./auth/auth.module').then(m=>m.AuthModule),canActivate:[LoginGuard]
  },
  { 
    path: 'post',
    loadChildren: () => import('./post/post.module').then(m => m.PostModule),canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }