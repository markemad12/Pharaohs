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

    // Add authentication check
    if (!this.authService.isLoggedIn()) {
      this.toastr.error('Please login to create notes', 'Authentication Required');
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    
    this.postService.create(this.form.value).subscribe({
      next: (res) => {
        this.toastr.success('Note created successfully!', 'Success');
        this.router.navigate(['/post']);
      },
      error: (err) => {
        console.error('Error creating post:', err);
        // Handle 403 specifically
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
}