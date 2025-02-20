import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-chat',
  standalone:true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: { sender: string; text: string }[] = [];
  userList: string[] = [];
  messageInput: string = '';
  userName = 'Mohamed';

  private messagesSubscription!: Subscription;
  private usersSubscription!: Subscription;

  constructor(private chatService: ChatService,private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userName = params.get('name') || 'Guest'; // Default to 'Guest' if no name is provided
    });
    this.chatService.joinChat(this.userName);

    // Subscribe to incoming messages
    this.messagesSubscription = this.chatService.getMessages().subscribe((message) => {
      this.messages.push(message);
    });

    // Subscribe to user list updates
    this.usersSubscription = this.chatService.getUserList().subscribe((users) => {
      this.userList = users;
    });
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      this.chatService.sendMessage({ sender: this.userName, text: this.messageInput });
      this.messageInput = '';
    }
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.chatService.disconnect();
  }
}
