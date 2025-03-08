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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');

    if (this.userId) {
      this.fetchTasks();
      this.listenForTaskUpdates();
    } else {
      console.error('User ID is missing');
    }
  }

  fetchTasks(): void {
    if (!this.userId) {
      console.error('User ID is missing');
      return;
    }

    this.taskService.getTasksByUserId(this.userId).subscribe(
      (tasks) => {
        this.tasks = tasks;
        console.log('Tasks fetched:', this.tasks);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }
  listenForTaskUpdates(): void {
    this.taskService.listenForTaskUpdates().subscribe(
      (taskUpdate) => {
        console.log('Received task update:', taskUpdate);

        // Handle task creation, update, or deletion
        const existingTaskIndex = this.tasks.findIndex(task => task.id === taskUpdate.id);

        if (taskUpdate.action === 'created') {
          // Add new task
          this.tasks.push(taskUpdate);
        } else if (taskUpdate.action === 'updated' && existingTaskIndex !== -1) {
          // Update existing task
          this.tasks[existingTaskIndex] = taskUpdate;
        } else if (taskUpdate.action === 'deleted' && existingTaskIndex !== -1) {
          // Remove the deleted task
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
