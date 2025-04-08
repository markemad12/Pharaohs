import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesComponent } from './notes/notes.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { 
    path: '',
    children: [
      { path: '', component: NotesComponent }, // Default route
      { path: 'create', component: CreateComponent },
      { path: ':id/edit', component: EditComponent },
      { path: ':id/view', component: ViewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }