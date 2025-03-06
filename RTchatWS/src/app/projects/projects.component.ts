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
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe((data: any[]) => {
      this.totalRecords = data.length;

      const startIndex = (this.currentPage - 1) * this.recordsPerPage;
      const endIndex = startIndex + this.recordsPerPage;
      this.projects = data.slice(startIndex, endIndex);

      console.log(this.projects);
    }, (error) => {
      console.error('Error fetching projects:', error);
    });
  }

  listenForProjectUpdates(): void {
    this.projectService.listenForProjectUpdates().subscribe((newProject) => {
      this.projects.push(newProject);
      console.log('Real-time project update:', newProject);
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
}
