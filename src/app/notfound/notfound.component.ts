// not-found.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `
 <div class="not-found-container">
  <div class="error-card">
    <h1>404</h1>
    <p>Page Not Found</p>
    
    <div class="button-group">
      <button (click)="returnHome()" class="btn btn-primary">
          Return to Home
      </button>
    </div>
  </div>
  
  <!-- Add SVG background elements if needed -->
</div>
  `,
  styleUrls: ['./notfound.component.scss']
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  returnHome(): void {
    this.router.navigate(['/post']);
  }
  returnlogin(): void {
    this.router.navigate(['/login']);
  }
}