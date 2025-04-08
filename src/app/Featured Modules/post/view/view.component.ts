// view.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post';
import { NotesService } from 'src/app/Featured Modules/post/services/notes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

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

  constructor(
    private notesService: NotesService,
    private route: ActivatedRoute,
    private router: Router
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

  deletePost(postId: number) {
    if(confirm('Are you sure you want to delete this post?')) {
      // Call your delete service here
      this.notesService.delete(postId).subscribe(() => {
        // Redirect or show success message
        this.router.navigate(['/post/notes']);
      });
    }
  }
  
}