import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private isBrowser: boolean; 

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (this.isBrowser && response && response.token) { 
            localStorage.setItem('auth-token', response.token);
          }
        })
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password });
  }

  logout(): void {
    if (this.isBrowser) { 
      localStorage.removeItem('auth-token');
    }
  }

  getToken(): string | null {
    if (this.isBrowser) { 
      return localStorage.getItem('auth-token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}