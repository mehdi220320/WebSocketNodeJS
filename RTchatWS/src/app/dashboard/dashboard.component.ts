import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { gantt } from 'dhtmlx-gantt';
import {ProjectService} from '../services/project.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    gantt.init(this.ganttContainer.nativeElement);
    this.loadProjectsWithTasks();
  }

  loadProjectsWithTasks() {
    this.projectService.getAllProjectsWithTasks().subscribe((projects: any[]) => {
      const formattedData = this.formatGanttData(projects);
      gantt.parse(formattedData);
    });
  }

  formatGanttData(projects: any[]): { data: any[], links: any[] } {
    let tasks: any[] = [];

    gantt.config.lightbox = {};
    gantt.config.drag_progress = false;
    gantt.config.drag_links = false;
    gantt.config.drag_resize = false;
    gantt.config.drag_move = false;

    projects.forEach((project: any) => {
      // Check if the project has tasks
      const hasTasks = project.tasks && project.tasks.length > 0;

      tasks.push({
        id: project._id,
        text: project.name,
        start_date: this.formatDate(project.createdAt),
        duration: hasTasks ? project.tasks.length * 5 : 10, // Default duration for empty projects
        progress: 0,
        type: "project", // Ensure it's a project
        open: true
      });

      if (hasTasks) {
        project.tasks.forEach((task: any) => {
          tasks.push({
            id: task._id,
            text: task.title,
            start_date: this.formatDate(task.dueDate),
            duration: 5, // Default duration
            progress: 0,
            parent: project._id,
            type: "task" // Ensure these are tasks
          });
        });
      }
    });

    return { data: tasks, links: [] }; // No links (arrows)
  }
  formatDate(dateString: string): string {
    if (!dateString) return new Date().toISOString().split('T')[0]; // Default to today
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  }
}
