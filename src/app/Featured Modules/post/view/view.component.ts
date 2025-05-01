// view.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post';
import { NotesService } from 'src/app/Featured Modules/post/notes/notes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  postId!: number;
  post?: Post;
  isLoading = true;
  errorMessage = '';
  notFound = false;
  posts: Post[] ;

  constructor(
    private notesService: NotesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,  
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost();
  }

  private loadPost(): void {
    this.notesService.find(this.postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (post) => {
          this.post = post;
          this.isLoading = false;
        },
        error: (error: Error) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
  }

  private handleError(error: Error): void {
    if (error.message.includes('not found')) {
      this.notFound = true;
      this.errorMessage = error.message;
      // Redirect to not-found after 3 seconds
      setTimeout(() => this.router.navigate(['/not-found']), 3000);
    } else {
      this.errorMessage = error.message;
      console.error('Error loading post:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deletePost(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notesService.delete(id).subscribe({
          next: () => {
            this.toastr.success('Post deleted successfully!', 'Success');
            this.router.navigate(['/post']); // Navigate after successful deletion
          },
          error: (err) => {
            this.toastr.error('Failed to delete post', 'Error');
            console.error('Delete error:', err);
          }
        });
      } else {
        this.toastr.info('Deletion canceled', 'Info');
      }
    });
  }
  }