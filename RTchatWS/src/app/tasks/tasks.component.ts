import { Component } from '@angular/core';
import {TaskService} from '../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  tasks: any[] = [];
  userId: string | null = null;
  userRole: string | null = null;
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userRole');
    if (this.userId) {
      this.fetchTasks();
      this.listenForTaskUpdates();
    } else {
      console.error('User ID is missing');
    }
  }

  fetchTasks(): void {
    if (!this.userId || !this.userRole) {
      console.error('User ID or Role is missing');
      return;
    }

    if (this.userRole === 'Admin') {
      this.taskService.getAllTasks().subscribe(
        (tasks) => {
          this.tasks = tasks;
          console.log('All tasks fetched for Admin:', this.tasks);
        },
        (error) => {
          console.error('Error fetching all tasks:', error);
        }
      );
    } else if (this.userRole === 'TeamLeader') {
      this.taskService.getTasksByTeamLeaderId(this.userId).subscribe(
        (tasks) => {
          this.tasks = tasks;
          console.log('Tasks assigned to team leader:', this.tasks);
        },
        (error) => {
          console.error('Error fetching team leader tasks:', error);
        }
      );
    } else if (this.userRole === 'Dev') {
      this.taskService.getTasksByUserId(this.userId).subscribe(
        (tasks) => {
          this.tasks = tasks;
          console.log('Tasks fetched for Dev:', this.tasks);
        },
        (error) => {
          console.error('Error fetching user tasks:', error);
        }
      );
    } else {
      console.error('Unrecognized user role:', this.userRole);
    }
  }
  updateTaskStatus(task: any): void {
    if (task.status) {
      this.taskService.updateTask(task._id, task).subscribe(
        (updatedTask) => {
          console.log('Task status updated successfully', updatedTask);
        },
        (error) => {
          console.error('Error updating task status:', error);
        }
      );
    }
  }
  listenForTaskUpdates(): void {
    this.taskService.listenForTaskUpdates().subscribe(
      (taskUpdate) => {
        console.log('Received task update:', taskUpdate);

        // Handle task creation, update, or deletion
        const existingTaskIndex = this.tasks.findIndex(task => task.id === taskUpdate.id);

        if (taskUpdate.action === 'created') {
          this.tasks.push(taskUpdate);
        } else if (taskUpdate.action === 'updated' && existingTaskIndex !== -1) {
          this.tasks[existingTaskIndex] = taskUpdate;
        } else if (taskUpdate.action === 'deleted' && existingTaskIndex !== -1) {
          this.tasks.splice(existingTaskIndex, 1);
          this.tasks = [...this.tasks];  // Trigger change detection
          console.log('Task deleted in real-time:', taskUpdate.id);
        }
      },
      (error) => {
        console.error('Error listening for task updates:', error);
      }
    );
  }
  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe(
        () => {
          this.tasks = this.tasks.filter(task => task.id !== taskId);
          console.log('Task deleted successfully');

        },
        (error) => {
          console.error('Error deleting task:', error);
        }
      );
    }
  }

}
