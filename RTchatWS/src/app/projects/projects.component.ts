import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  newProject: any = {};
  expandedProjectIds: Set<string> = new Set();

  tryby: string = "time";
  currentPage: number = 1;
  recordsPerPage: number = 5;
  totalRecords: number = 0;

  constructor(
    private projectService: ProjectService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.listenForProjectUpdates();
    this.listenForTaskAssignments();
  }

  fetchProjects(): void {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!userRole || !userId) {
      console.error('Error: User role or ID is missing');
      return;
    }

    let fetchMethod;

    if (userRole === 'Admin') {
      fetchMethod = this.projectService.getAllProjects();
    } else if (userRole === 'TeamLeader') {
      fetchMethod = this.projectService.getProjectsByTeamLeader(userId);
    } else if (userRole === 'Dev') {
      fetchMethod = this.projectService.getProjectsByUser(userId);
    } else {
      console.error('Error: Unknown role');
      return;
    }

    fetchMethod.subscribe(
      (data: any[]) => {
        const sortedProjects = this.tryProjects(this.tryby, data);

        this.totalRecords = sortedProjects.length;
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        this.projects = sortedProjects.slice(startIndex, endIndex);

        console.log('Projects fetched and sorted:', this.projects);
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  listenForProjectUpdates(): void {
    this.projectService.listenForProjectUpdates().subscribe((newProject) => {
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');

      if (!userRole || !userId || !newProject || !newProject._id) {
        console.error('Error: Invalid project data or missing user info');
        return;
      }

      const projectExists = this.projects.some(project => project._id === newProject._id);

      if (!projectExists) {
        if (userRole === 'Admin' || (userRole === 'TeamLeader' && newProject.teamLeader === userId)) {
          this.projects = [...this.projects, newProject];
          console.log('New project added:', newProject);
        } else if (userRole === 'Dev' && newProject.assignedTo.includes(userId)) {
          this.projects = [...this.projects, newProject];
          console.log('New project added for Dev:', newProject);
        }
      } else {
        console.log('Skipping duplicate project:', newProject._id);
      }
    });
  }

  listenForTaskAssignments(): void {
    this.projectService.listenForTaskAssignments().subscribe((task) => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('Error: User ID is missing');
        return;
      }

      if (task.assignedTo.includes(userId)) {
        const projectId = task.project;

        if (this.projects.some(project => project._id === projectId)) {
          console.log('Project already exists, skipping:', projectId);
          return;
        }

        this.projectService.getProjectById(projectId).subscribe((newProject) => {
          if (!newProject || Object.keys(newProject).length === 0) {
            console.error('Error: Invalid project data received:', newProject);
            return;
          }

          if (!this.projects.some(project => project._id === newProject._id)) {
            this.projects.push(newProject);
            console.log('New project added for Dev:', newProject);
          } else {
            console.log('Project already in list, skipping:', newProject._id);
          }
        });
      }
    });
  }

  deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe(
        () => {
          this.projects = this.projects.filter(project => project._id !== projectId);
          console.log('Project deleted successfully');
        },
        (error) => {
          console.error('Error deleting project:', error);
        }
      );
    }
  }

  toggleTasks(projectId: string): void {
    if (this.expandedProjectIds.has(projectId)) {
      this.expandedProjectIds.delete(projectId);
    } else {
      this.expandedProjectIds.add(projectId);
    }
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchProjects();
  }

  onRecordsPerPageChange(records: number): void {
    this.recordsPerPage = records;
    this.currentPage = 1;
    this.fetchProjects();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.recordsPerPage);
  }

  protected readonly Math = Math;

  tryProjects(tryby: string, data: any[]) {
    switch (tryby) {
      case 'time':
        return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      case 'status':
        return data.sort((a, b) => {
          const statusOrder = ['Completed', 'In Progress', 'Pending'];
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });

      case 'title':
        return data.sort((a, b) => a.name.localeCompare(b.name));

      default:
        return data;
    }
  }

  try(tryby: string) {
    this.tryby = tryby;
    this.fetchProjects();
  }
}
