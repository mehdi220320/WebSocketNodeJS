import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient, private chatService: ChatService) {}

  createTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, task, this.getHttpOptions());
  }

  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`, this.getHttpOptions());
  }

  getTaskById(taskId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${taskId}`, this.getHttpOptions());
  }

  updateTask(taskId: string, updatedTask: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}`, updatedTask, this.getHttpOptions());
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`, this.getHttpOptions());
  }

  listenForTaskUpdates(): Observable<any> {
    return this.chatService.getTaskUpdates();
  }

  // emitNewTask(task: any) {
  //   this.chatService.sendTask(task);
  // }
  getTasksByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, this.getHttpOptions());
  }

  private getHttpOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return { headers };
  }
}
