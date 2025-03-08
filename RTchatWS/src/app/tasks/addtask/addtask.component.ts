import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-addtask',
  standalone: false,
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.css'
})
export class AddtaskComponent  {
  taskDetails: any = {};
  loggedInUserId: string = '';
  projectId: string = '';
  users: any[] = [];
  selectedUserId: string = '';
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getLoggedInUserId();
    this.getProjectIdFromPath();
    this.getUsersByTeamLeader();
  }
  getUsersByTeamLeader(): void {
    this.userService.getUsersByTeamLeader(this.loggedInUserId).subscribe(
      (response: any) => {
        if (Array.isArray(response.users)) {
          this.users = response.users;
        } else {
          console.error('Invalid users response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  getLoggedInUserId(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loggedInUserId = userId;
    }
  }

  getProjectIdFromPath(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
  }

  createTask(): void {
    const newTask = {
      title: this.taskDetails.title,
      description: this.taskDetails.description,
      assignedTo: this.selectedUserId, // Assign the selected user
      project: this.projectId,
      status: this.taskDetails.status,
      dueDate: this.taskDetails.dueDate
    };

    this.taskService.createTask(newTask).subscribe(
      (task) => {
        console.log('Task created:', task);
        this.router.navigate(['/tasks']);
      },
      (error) => {
        console.error('Error creating task:', error);
      }
    );
  }
}
