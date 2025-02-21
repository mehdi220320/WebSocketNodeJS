import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private serverUrl = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.serverUrl);
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

  getUserList(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('userList', (users) => observer.next(users));
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
