import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { gantt } from 'dhtmlx-gantt';
import {ProjectService} from '../services/project.service';
import {TaskService} from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

  constructor(private projectService: ProjectService, private taskservice : TaskService) {}

  totalProjects: any;
  pendingPercentage: any;
  inProgressPercentage: any;
  completedPercentage: any;
  totaltask: any;
  ToDotasks: any;
  inProgresstasks: any;
    completedtasks: any;
  ngOnInit() {
    gantt.init(this.ganttContainer.nativeElement);
    this.loadProjectsWithTasks();
    this.statisticsproj();
    this.statisticstask();
    gantt.templates.task_text = (start, end, task) => {
      const styles = this.getTaskStyles(task);
      return `<div style="background-color:${styles.color}; border:1px solid ${styles.borderColor}; padding:5px;">${task.text}</div>`;
    };
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
  statisticstask() {
    this.taskservice.gettasksStateStatistics().subscribe((response: any) => {
      const stats = response.statistics;
      this.totaltask = stats.totalTasks;
      this.ToDotasks = stats.ToDo;
      this.inProgresstasks = stats.InProgress;
      this.completedtasks = stats.Completed;
    });

  }
  loadProjectsWithTasks() {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    if (userRole === 'TeamLeader') {
      this.projectService.getProjectsWithTasksforteamleader(userId).subscribe((projects: any[]) => {
        console.log('Projects:', projects);
        const formattedData = this.formatGanttData(projects);
        console.log('Formatted Data:', formattedData);
        gantt.parse(formattedData);
      });
    } else {
      this.projectService.getAllProjectsWithTasks().subscribe((projects: any[]) => {
        console.log('Projects:', projects);
        const formattedData = this.formatGanttData(projects);
        console.log('Formatted Data:', formattedData);
        gantt.parse(formattedData);
      });
    }
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
      const projectStart = new Date(project.createdAt);
      const projectEnd = hasTasks
        ? new Date(Math.max(...project.tasks.map((t: any) => new Date(t.dueDate).getTime())))
        : new Date(projectStart.getTime() + 10 * 24 * 60 * 60 * 1000); // Default 10 days if no tasks

      tasks.push({
        id: project._id,
        text: project.name,
        start_date: this.formatDate(projectStart),
        duration: Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)), // Duration in days
        progress: 0,
        type: "project",
        open: true
      });

      if (hasTasks) {
        project.tasks.forEach((task: any) => {
          const taskStart = new Date(task.createdAt);
          const taskEnd = new Date(task.dueDate);
          const duration = Math.max(1, Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)));

          tasks.push({
            id: task._id,
            text: task.title,
            start_date: this.formatDate(taskStart),
            duration: duration,
            progress: task.progress || 0,
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
  private getTaskStyles(task: any): { color: string; borderColor: string } {
    const currentDate = new Date();
    const endDate = new Date(task.end_date);
    const closedAt = task.closedAt ? new Date(task.closedAt) : null;

    let color = '';
    let borderColor = '';


    if (currentDate > endDate) {

      color = '#dc3510';
    }

    borderColor = color || 'transparent';
    return {color, borderColor};
  }
}
