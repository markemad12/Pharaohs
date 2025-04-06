import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private apiUrl = 'http://localhost:8000/notes';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(() => this.log('Fetched all notes')),
      catchError(this.handleError)
    );
  }

  find(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.log(`Fetched note ${id}`)),
      catchError((error: HttpErrorResponse) => 
        error.status === 404 
          ? throwError(() => new Error(`Note with ID ${id} not found`))
          : this.handleError(error)
      )
    );
  }

  create(noteData: Omit<Note, 'id'>): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, noteData, { headers: this.getHeaders() }).pipe(
      tap((newNote) => this.log(`Created note ${newNote.id}`)),
      catchError(this.handleError)
    );
  }

  update(id: number, data: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() }).pipe(
      tap(() => this.log(`Updated note ${id}`)),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.log(`Deleted note ${id}`)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.message || 'Unknown error occurred';
    this.log(`Error: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }

  private log(message: string): void {
    console.log(`NotesService: ${message}`);
  }
}