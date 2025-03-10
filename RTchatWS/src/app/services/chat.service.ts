import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000';
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(this.apiUrl);
  }
  getChatByUser(userId:string):Observable<any[]>{
    return this.http.get<any>(`${this.apiUrl}/chat/user/${userId}`);
  }
  getChatById(chatId:string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/chat/${chatId}`);
  }
  joinChat(chatID: string): void {
    this.socket.emit('joinChat', chatID);
  }

  getMessagesByChat(chatID: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chat/messages/${chatID}`);
  }

  sendMessage(data: any, chatID: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat/message/${chatID}`, data);
  }

  listenForNewMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newMessage', (message) => observer.next(message));
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
