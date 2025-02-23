import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '../services/chat.service';
import {ActivatedRoute} from '@angular/router';
import {Task} from '../models/Task'
@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit, OnDestroy  {
  userList: string[] = [];
  private usersSubscription!: Subscription;
  private taskSubscription!:Subscription;
  userName = '';
  taskList:Task[]=[];
  task !:Task;
  id:number=0;

  constructor(private chatService: ChatService,private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userName = params.get('name') || 'Guest';
    });
    this.chatService.joinChat(this.userName);

    this.usersSubscription = this.chatService.getUserList().subscribe((users) => {
      this.userList = users;
    });
    this.taskSubscription = this.chatService.getTask().subscribe((task)=>{
      // console.log(task)
      this.taskList.push(task)
      console.log(this.taskList)
      }
    )
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
    this.chatService.disconnect();
  }
  newTasl() {
    this.task = { id: this.id++, title: "suiiiiiiiiiii", description: 'tttttttttttttttttyt' ,author: this.userName};
    this.chatService.sendTask(this.task)
  }
}
