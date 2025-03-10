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
  totalProjects: any;
  pendingPercentage: any;
  inProgressPercentage: any;
  completedPercentage: any;
  ngOnInit() {
    gantt.init(this.ganttContainer.nativeElement);
    this.loadProjectsWithTasks();
    this.statisticsproj()
  }
statisticsproj() {
  this.projectService.getProjectStateStatistics().subscribe((response: any) => {
    const stats = response.statistics;
    this.totalProjects = stats.totalProjects;
    this.pendingPercentage = stats.Pending;
    this.inProgressPercentage = stats.InProgress;
    this.completedPercentage = stats.Completed;
  });

}
  loadProjectsWithTasks() {
    this.projectService.getAllProjectsWithTasks().subscribe((projects: any[]) => {
      const formattedData = this.formatGanttData(projects);
      console.log(formattedData);

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
      const hasTasks = project.tasks && project.tasks.length > 0;

      tasks.push({
        id: project._id,
        text: project.name,
        start_date: this.formatDate(project.createdAt),
        duration: hasTasks ? project.tasks.length * 5 : 10,
        progress: 0,
        type: "project",
        open: true
      });

      if (hasTasks) {
        project.tasks.forEach((task: any) => {
          tasks.push({
            id: task._id,
            text: task.title,
            start_date: this.formatDate(task.dueDate),
            duration: 5,
            progress: 0,
            parent: project._id,
            type: "task"
          });
        });
      }
    });

    return { data: tasks, links: [] };
  }
  private formatDate(date: Date): string | null {
    if (!date) return null;

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }

}
