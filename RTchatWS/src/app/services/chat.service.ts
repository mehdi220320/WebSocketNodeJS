import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import{Task} from '../models/Task'
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private serverUrl = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.serverUrl);
  }
  sendProject(project: any): void {
    this.socket.emit('sendProject', project);
  }
  getTaskUpdates(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('taskCreated', (task) => observer.next(task));
    });
  }
  getProjectUpdates(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('projectCreated', (project) => observer.next(project));
      this.socket.on('projectUpdated', (project) => observer.next(project));
    });
  }
  joinChat(username: string): void {
    this.socket.emit('join', username);
  }

  sendMessage(message: { sender: string; text: string }): void {
    console.log('Sending message:', message);
    this.socket.emit('sendMessage', message);
  }

  getMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receiveMessage', (message) => observer.next(message));
    });
  }
  sendTask(task:Task){
    this.socket.emit("sendTask", { id: task.id, title: task.title, description: task.description });
  }
  getTask():Observable<any>{
    return new Observable(observer=>{
      this.socket.on('taskList',(task)=>observer.next(task))
    })
  }

  getUserList(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('userList', (users) => observer.next(users));
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
