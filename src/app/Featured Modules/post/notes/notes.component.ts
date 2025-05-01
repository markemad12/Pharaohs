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
  posts: Post[];

  constructor(
    public postService: NotesService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.postService.getAll().subscribe({
      next: (data: Post[]) => {
        this.posts = data || [];
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.posts = [];
        this.toastr.error('Failed to load posts', 'Error');
      }
    });
  }

  updateTask(post: Post): void {
    this.postService.update(post.id, post).subscribe({
      next: (updatedPost) => {
        this.posts = this.posts.map(p => p.id === post.id ? updatedPost : p);
        this.toastr.success('Post updated successfully', 'Success');
      },
      error: (err) => {
        console.error('Error updating task:', err);
        this.toastr.error('Failed to update post', 'Error');
      }
    });
  }

  deletePost(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this post?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postService.delete(id).subscribe({
          next: () => {
            this.posts = this.posts.filter(item => item.id !== id);
            this.toastr.success('Post deleted successfully!', 'Success');
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