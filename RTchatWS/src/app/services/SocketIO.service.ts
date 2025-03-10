import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
  private socket: Socket;
  private serverUrl = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.serverUrl);
  }
  getTaskUpdates(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('taskCreated', (task) => observer.next({ action: 'created', ...task }));
      this.socket.on('taskUpdated', (task) => observer.next({ action: 'updated', ...task }));
      this.socket.on('taskDeleted', (task) => {
        console.log('Received task deletion event:', task);
        observer.next({ action: 'deleted', ...task });
      });
    });
  }
  getTaskUpdatesForUser(userId: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on('taskCreated', (task) => {
        if (task.assignedTo === userId) {
          observer.next({ action: 'created', ...task });
        }
      });
    });
  }
  getProjectUpdates(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('projectCreated', (project) => observer.next(project));
      this.socket.on('projectUpdated', (project) => observer.next(project));
    });
  }

  joinChat(chatID: string): void {
    this.socket.emit('joinChat', chatID);
  }

  sendMessage(message: { chatID: string, sender: string, content: string }): void {
    console.log('Sending message:', message);
    this.socket.emit('sendMessage', message);
  }

  getMessages(chatID: string): Observable<any> {
    return new Observable(observer => {
      this.joinChat(chatID);
      this.socket.on('messagesFetched', (messages) => {observer.next(messages);});
    });
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
