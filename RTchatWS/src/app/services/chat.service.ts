import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/projects';
  constructor(private http: HttpClient){}
  getMessagesByChat(chatID: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chat/messages/${chatID}`);
  }


}
