import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../services/project.service';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getAllProjects();
  }

  // Fetch all projects
  getAllProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (data) => {
        this.projects = data;
        console.log(this.projects)    },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }
}
