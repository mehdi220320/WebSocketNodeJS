import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}


  getAllUsers(): Observable<string[]> {


    return this.http.get<string[]>(this.apiUrl, this.getHttpOptions());
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`, this.getHttpOptions());
  }

  activateUser(userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/activate`, {}, this.getHttpOptions());
  }

  assignTeamLeader(userId: string, teamLeaderId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/assign-team-leader`,
      { teamLeaderId }, this.getHttpOptions());
  }
  getInactiveUsers(): Observable<{ users: any[] }> {
    return this.http.get<{ users: any[] }>(`${this.apiUrl}/inactive-users`, this.getHttpOptions());
  }
  getUsersByTeamLeader(teamLeaderId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/team-leader/${teamLeaderId}`, this.getHttpOptions());
  }
  private getHttpOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    return { headers };
  }


}
