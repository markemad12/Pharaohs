import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Featured Modules/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  isSubmitting = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      age: ['', [Validators.required]],
      address: ['', [Validators.required]]
  });
  }
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    // Mark all fields as touched to show errors
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
  
    if (this.isSubmitting) return;
  
    this.isSubmitting = true;
    const formData = { ...this.registerForm.value };
    delete formData.confirmPassword;
  
    this.subscription = this.authService.register(formData).subscribe({
      next: () => {
        this.toastr.success('Registration successful!', 'Success');
        this.router.navigate(['post'], {
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(error.message || 'Registration failed', 'Error');
      },
      complete: () => this.isSubmitting = false
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}