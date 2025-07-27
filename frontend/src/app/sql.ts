import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SqlService {
  // The URL for your backend API endpoint.
  private apiUrl = 'http://localhost:3000/api/dosql'; 

  constructor(private http: HttpClient) { }

  /**
   * Executes a SQL command string by sending it to the backend API.
   * @param sql The raw SQL string to execute.
   * @returns An Observable that emits an array of result strings.
   */
  executeSql(sql: string): Observable<string[]> {
    // We send the raw SQL string as the body of the POST request.
    // The backend should be configured to expect a text/plain body.
    return this.http.post<string[]>(this.apiUrl, sql, {
      headers: { 'Content-Type': 'text/plain' }
    }).pipe(
      // Basic error handling in case the API call fails.
      catchError((error) => {
        console.error('API Error:', error);
        // Return a user-friendly error message as a result.
        return of([`Error executing SQL: ${error.message}`]);
      })
    );
  }
}
