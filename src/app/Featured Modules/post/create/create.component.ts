import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotesService } from 'src/app/Featured Modules/post/notes/notes.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;

  constructor(
    public postService: NotesService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      priority: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required])
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.markFormControlsAsTouched();
      return;
    }
  
    // تأكد من تسجيل الدخول
    if (!this.authService.isLoggedIn()) {
      this.toastr.error('Please login to create notes', 'Authentication Required');
      this.router.navigate(['/login']);
      return;
    }
  
    // حوّل الـtags من نص إلى مصفوفة
    const formData = {
      ...this.form.value,
      tags: this.form.value.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
    };
  
    this.isLoading = true;
    // أرسل formData بدل this.form.value
    this.postService.create(formData).subscribe({
      next: (res) => {
        this.toastr.success('Note created successfully!', 'Success');
        this.router.navigate(['/post']);
      },
      error: (err) => {
        console.error('Error creating post:', err);
        if (err.message.includes('403')) {
          this.toastr.error('Permission denied. Contact administrator.', 'Error');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(err.message || 'Failed to create note', 'Error');
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  private markFormControlsAsTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  getPriorityColor(priority: string): string {
  switch(priority) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'inherit'; // اللون الافتراضي
  }
}
}