import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { NotesService } from 'src/app/post/notes.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  posts: Post[] = [];

  constructor(public postService: NotesService ) { }

  ngOnInit(): void {
    this.postService.getAll().subscribe({
      next: (data: Post[]) => {
        this.posts = data;
        console.log('Posts loaded:', this.posts);
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.posts = []; // Ensure posts remains an array
      }
    });
  }

  updateTask(post: Post) {
    this.postService.update(post.id, post).subscribe({
      next: (updatedPost) => {
        console.log('Task updated!', updatedPost);
        // تحديث القائمة بالبيانات الجديدة
        this.posts = this.posts.map(p => p.id === post.id ? updatedPost : p);
      },
      error: (err) => {
        console.error('Error updating task:', err);
      }
    });
  }
  deletePost(id:number){

    this.postService.delete(id).subscribe(res => {

         this.posts = this.posts.filter(item => item.id !== id);

         console.log('Post deleted successfully!');

    })

  }
}
