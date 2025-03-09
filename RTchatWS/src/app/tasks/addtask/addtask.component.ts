import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {UserService} from '../../services/user.service';
import {ProjectService} from '../../services/project.service';

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
  projects: any[] = []; // List of projects for the select dropdown
  selectedProjectId: string = ''; // Selected project ID
  users: any[] = [];
  selectedUserId: string = '';
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private userService: UserService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getLoggedInUserId();
    this.getUsersByTeamLeader();
    this.getProjectsByTeamLeader();
  }
  getProjectsByTeamLeader(): void {
    this.projectService.getProjectsByTeamLeader(this.loggedInUserId).subscribe(
      (projects: any[]) => {
        this.projects = projects;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
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


  createTask(): void {
    const newTask = {
      title: this.taskDetails.title,
      description: this.taskDetails.description,
      assignedTo: this.selectedUserId,
      project: this.selectedProjectId,
      status: this.taskDetails.status,
      dueDate: this.taskDetails.dueDate,
      teamLeader:this.loggedInUserId,
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
