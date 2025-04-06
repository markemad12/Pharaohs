// not-found.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `
  <div class="container text-center mt-5">
    <h1 class="text-danger">404 - Page Not Found</h1>
    <p>The requested resource could not be found</p>
    <button (click)="returnHome()" class="btn btn-primary">
      Return to Home
    </button>
  </div>
  `
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  returnHome(): void {
    this.router.navigate(['/post/notes']);
  }
}