import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { NotesService } from 'src/app/Featured Modules/post/notes/notes.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  posts: Post[] = [];

  constructor(public postService: NotesService , private toastr: ToastrService,  private dialog: MatDialog) { }

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
  deletePost(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postService.delete(id).subscribe({
          next: () => {
            this.toastr.success('Post deleted successfully!', 'Success');
            this.posts = this.posts.filter(item => item.id !== id);
          },
          error: (err) => {
            this.toastr.error('Failed to delete post', 'Error');
            console.error('Delete error:', err);
          }
        });
      }
    });
  }
}
