import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string, role: string): Observable<any> {
   console.log(name, email, password, role);
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password, role });
  }

  loginn(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
}
