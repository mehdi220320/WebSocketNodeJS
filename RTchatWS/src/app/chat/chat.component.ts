import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: { sender: { _id: string, name: string }; content: string ;createdAt:Date}[] = [];
  chat: { _id: string; project: { _id: string; name: string }[] } = { _id: '', project: [] };
  messageInput: string = '';
  userName = localStorage.getItem('userId') || 'Guest';
  chatID = '';
  chats: { _id: string; project: { _id: string, name: string }[] }[] = [];
  private messagesSubscription!: Subscription;
  private newMessageSubscription!: Subscription;

  constructor(private chatService: ChatService, private route: ActivatedRoute,private router:Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.chatID = params.get('chatID') || '';
      if (this.chatID) {
        console.log("Chat ID from route:", this.chatID);
        this.chatService.joinChat(this.chatID);
        this.loadMessages();
      }
    });
    this.chatService.getChatById(this.chatID).subscribe((data)=>{
      this.chat=data;
      console.log("chat",this.chat)

    },(error)=>{
      console.log(error)
    })
    this.newMessageSubscription = this.chatService.listenForNewMessages().subscribe((message) => {
      console.log("New message received:", message); // Check if messages are arriving
      this.messages.push({
        sender: Array.isArray(message.sender) && message.sender.length > 0 ? message.sender[0] : { _id: message.sender, name: 'Unknown' },
        content: message.content,
        createdAt: new Date(message.createdAt)
      });
    });
    this.chatService.getChatByUser(this.userName).subscribe((data)=>{
      this.chats=data
      console.log("chats :",this.chats)
    })

  }

  loadMessages() {
    this.messagesSubscription = this.chatService.getMessagesByChat(this.chatID).subscribe((messages) => {
      this.messages = messages.map(msg => ({
        sender: Array.isArray(msg.sender) && msg.sender.length > 0 ? msg.sender[0] : { _id: msg.sender, name: 'Unknown' },
        content: msg.content,
        createdAt: new Date(msg.createdAt)
      }));
      console.log("Messages loaded:", this.messages); // Add this for debugging
    });
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      const message = {
        sender: this.userName,
        content: this.messageInput
      };

      this.chatService.sendMessage(message, this.chatID).subscribe(
        (data) => {
          console.log("Message sent:", data);
        },
        (error) => {
          console.error("Error sending message:", error);
        }
      );

      this.messageInput = '';
    }
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }
    this.chatService.disconnect();
  }
  getTimeSinceSent(dateAjout: Date): string {
    const now = new Date();
    const timeDifference = now.getTime() - new Date(dateAjout).getTime();

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    return 'Just now';
  }
  getRoute(chat: any): string {
    return chat.project.length > 0 ? `/chat/${chat.project[0]._id}` : '/chat/0';
  }
  Navigate(chatid: string) {
    this.router.navigate(['/chat', chatid]).then(() => {
      window.location.reload();
    });
  }}
