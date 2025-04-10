import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './Featured Modules/post/create/create.component';
import { ViewComponent } from './Featured Modules/post/view/view.component';
import { EditComponent } from './Featured Modules/post/edit/edit.component';
import { NotesComponent } from './Featured Modules/post/notes/notes.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';


const routes: Routes = [
  {
    path:'', loadChildren:() => import('./Featured Modules/auth/auth.module').then(m=>m.AuthModule),canActivate:[LoginGuard]
  },
  { 
    path: 'post',
    loadChildren: () => import('./Featured Modules/post/post.module').then(m => m.PostModule),canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }