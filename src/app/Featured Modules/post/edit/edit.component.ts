import { Component, OnInit } from '@angular/core';
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

  // edit.component.ts
ngOnInit(): void {
  this.form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    tags: new FormControl('', [Validators.required]) // يتوقع قيمة نصية هنا
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
        tags: this.post.tags.join(', ') // <-- تحويل المصفوفة إلى سلسلة نصية
      });
    },
    error: (error) => {
      console.error('Error fetching post:', error);
    }
  });
}

  submit() {
    // قم بتحويل الـ tags إلى مصفوفة بشكل صحيح
    const formData = {
      ...this.form.value,
      tags: this.form.value.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
    };
  
    // يجب استخدام formData بدلًا من this.form.value
    this.postService.update(this.id, formData).subscribe({ // <-- التعديل هنا
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
  get f() {
    return this.form.controls;
  }
}