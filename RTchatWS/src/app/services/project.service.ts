import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { SocketIOService } from './SocketIO.service';
 @Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projects';
  constructor(private http: HttpClient ,         private chatService: SocketIOService  ) {}

  createProject(project: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, project, this.getHttpOptions());
  }
   getProjectStateStatistics(): Observable<any> {
     return this.http.get<any>(`${this.apiUrl}/project-statistics`, this.getHttpOptions());
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
   getProjectsByTeamLeader(teamLeaderId: string): Observable<any[]> {
     return this.http.get<any[]>(`${this.apiUrl}/teamleader/${teamLeaderId}`, this.getHttpOptions());
   }

   getProjectsByUser(userId: string): Observable<any[]> {
     return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, this.getHttpOptions());
   }

  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}`, this.getHttpOptions());
  }
   listenForProjectUpdates(): Observable<any> {
     return this.chatService.getProjectUpdates();
   }
   getAllProjectsWithTasks(): Observable<any[]> {
     return this.http.get<any[]>(`${this.apiUrl}/with-tasks`, this.getHttpOptions());
   }
   getProjectsWithTasksforteamleader(projectId: any): Observable<any[]> {
     return this.http.get<any[]>(`${this.apiUrl}/teamleader/with-tasks/${projectId}`, this.getHttpOptions());
   }
   listenForTaskAssignments() {
     return this.chatService.getTaskUpdates();
   }
   // emitNewProject(project: any) {
   //   this.chatService.sendProject(project);
   // }

   private getHttpOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return { headers };
  }

}
