import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ProjectService} from '../../services/project.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-project',
  standalone: false,
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent implements OnInit {
  listUsers: any[] = [];
  selectedList: any[] = [];
  projectDetails: any = {};
  loggedInUserId: string = '';

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private route:Router
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.getLoggedInUserId();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users: any[]) => {
        this.listUsers = users.filter(user => user.role === 'TeamLeader');
        console.log('Filtered Team Leaders:', this.listUsers);
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

  addToSelectedList(event: Event): void {
    const selectedUser = (event.target as HTMLSelectElement).value;

    if (selectedUser) {
      this.selectedList = [selectedUser];
    }
  }

  deleteFromSelectedList(user: string): void {
    this.selectedList = this.selectedList.filter((u) => u !== user);
  }

  createProject(): void {
    const newProject = {
      name: this.projectDetails.name,
      description: this.projectDetails.description,
      status: this.projectDetails.status,
      teamLeader: this.selectedList[0],
      createdBy: this.loggedInUserId,
    };

    this.projectService.createProject(newProject).subscribe(
      (project) => {
        console.log('Project created:', project);
        this.route.navigate(['/projects']);


      },
      (error) => {
        console.error('Error creating project:', error);
      }
    );
  }
}
