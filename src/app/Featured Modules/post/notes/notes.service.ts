import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { Post } from '../post';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private apiUrl = `${environment.apiUrl}/notes`; // Use environment-based URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      tap(() => this.log('Fetched all notes')),
      catchError(this.handleError)
    );
  }

  find(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.log(`Fetched note ${id}`)),
      catchError((error: HttpErrorResponse) => 
        error.status === 404 
          ? throwError(() => new Error(`Note with ID ${id} not found`))
          : this.handleError(error)
      )
    );
  }

  create(noteData: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, noteData).pipe(
      tap((newNote) => this.log(`Created note ${newNote.id}`)),
      catchError(this.handleError)
    );
  }

  update(id: number, data: Partial<Post>): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}`, data).pipe(
      tap(() => this.log(`Updated note ${id}`)),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.log(`Deleted note ${id}`)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = this.getServerErrorMessage(error);
    }
    
    this.log(`Error: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return 'Bad request: Please check your input data';
      case 401:
        return 'Unauthorized: Please login again';
      case 403:
        return 'Forbidden: You do not have permission';
      case 404:
        return `Resource not found: ${error.error?.message || ''}`;
      case 500:
        return 'Server error: Please try again later';
      default:
        return error.error?.message || error.message || 'Unknown server error';
    }
  }

  private log(message: string): void {
    if (!environment.prodution) {
      console.log(`[${new Date().toISOString()}] NotesService: ${message}`);
    }
  }
}