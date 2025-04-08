import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './notes/notes.component';
import { ViewComponent } from './view/view.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PostsRoutingModule } from './post-routing.module';


@NgModule({
  declarations: [
    CreateComponent,
    EditComponent,
    ViewComponent,
    NotesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PostsRoutingModule
  ]
})
export class PostModule { }
