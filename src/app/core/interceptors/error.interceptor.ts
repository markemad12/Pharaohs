import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Featured Modules/auth/auth.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log({err});
        
        // التعامل مع أخطاء 401 (Unauthorized) و 403 (Forbidden)
        if (err.status === 401 || err.status === 403) {
          this.authService.logout(); // استدعاء دالة تسجيل الخروج
          this.router.navigate(['/login']); // إعادة التوجيه إلى صفحة اللوجن
        }
        
        return throwError(() => err);
      })
    );
  }
}