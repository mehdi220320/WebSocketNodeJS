import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SocketIOService } from '../services/SocketIO.service';
import { ActivatedRoute } from '@angular/router';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: { sender: string; text: string }[] = [];
  userList: string[] = [];
  messageInput: string = '';
  userName = '67b8c64327a3bbce9a68b31d';
  chatID = '';
  // messageList
  private messagesSubscription!: Subscription;
  private usersSubscription!: Subscription;

  constructor(private socketIOService: SocketIOService, private route: ActivatedRoute,private chatService:ChatService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.chatID = params.get('chatID') || '';
    });

    if (this.chatID) {
      this.socketIOService.joinChat(this.chatID);

      this.messagesSubscription = this.socketIOService.getMessages(this.chatID).subscribe((messages) => {
        console.log(messages)
        this.messages = messages;
      });

    }
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      const message = {
        chatID: this.chatID,
        sender: this.userName,
        content: this.messageInput
      };
      this.socketIOService.sendMessage(message);
      this.messageInput = '';
    }
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    this.socketIOService.disconnect();
  }
}
