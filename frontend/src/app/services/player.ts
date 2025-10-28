import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth'; 

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPlayers(filters: any): Observable<any> {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    }
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl, { headers: headers, params: params });
  }

  getPlayerById(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: headers });
  }
  updatePlayer(id: string, data: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers: headers });
  } 
  createPlayer(data: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.apiUrl, data, { headers: headers });
  }
}