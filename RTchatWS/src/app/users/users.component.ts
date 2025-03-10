import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  inactiveUsers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchInactiveUsers();
  }

  fetchInactiveUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response) => {
        this.inactiveUsers = response;
        console.log("Updated inactiveUsers array:", this.inactiveUsers);
      },
      (error) => {
        console.error("Error fetching inactive users:", error);
      }
    );
  }
  toggleActivation(userId: string): void {
    this.userService.activateUser(userId).subscribe(
      (response) => {
        this.fetchInactiveUsers();
      },
      (error) => {
        console.error("Error toggling activation:", error);
      }
    );}
}
