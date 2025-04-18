import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from '../post';
import { NotesService } from 'src/app/Featured Modules/post/notes/notes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  id!: number;
  post!: Post;
  form!: FormGroup;

  constructor(
    public postService: NotesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Initialize form first
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      priority: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required])
    });

    this.id = +this.route.snapshot.params['id'];
    
    this.postService.find(this.id).subscribe({
      next: (data: Post) => {
        this.post = data;
        this.form.patchValue({
          title: this.post.title,
          content: this.post.content,
          category: this.post.category,
          priority: this.post.priority,
          tags: this.post.tags
        });
      },
      error: (error) => {
        console.error('Error fetching post:', error);
        // Handle error (e.g., redirect or show message)
      }
    });
  }

  submit() {
    this.postService.update(this.id, this.form.value).subscribe({
      next: () => {
        this.toastr.success('Updated successfully');
        this.router.navigate(['/post']);
      },
      error: (error) => {
        if (error.message.includes('not found')) {
          this.toastr.error('This note has been deleted');
          this.router.navigate(['/post']);
        } else {
          this.toastr.error(`Update failed: ${error.message}`);
        }
      }
    });
  }
}