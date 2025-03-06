import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projects';
  constructor(private http: HttpClient) {}

  createProject(project: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, project, this.getHttpOptions());
  }

  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`, this.getHttpOptions());
  }

  getProjectById(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${projectId}`, this.getHttpOptions());
  }

  updateProject(projectId: string, updatedProject: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${projectId}`, updatedProject, this.getHttpOptions());
  }

  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}`, this.getHttpOptions());
  }

  private getHttpOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return { headers };
  }

}
