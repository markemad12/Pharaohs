import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';
import { NotFoundComponent } from './notfound/notfound.component';


const routes: Routes = [
  {
    path:'', loadChildren:() => import('./Featured Modules/auth/auth.module').then(m=>m.AuthModule),canActivate:[LoginGuard]
  },
  { 
    path: 'post',
    loadChildren: () => import('./Featured Modules/post/post.module').then(m => m.PostModule),canActivate:[AuthGuard]
  },
  {
    path:'**', component:NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }