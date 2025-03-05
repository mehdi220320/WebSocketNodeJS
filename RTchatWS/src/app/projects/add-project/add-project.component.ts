import { Component } from '@angular/core';

@Component({
  selector: 'app-add-project',
  standalone: false,
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  listUsers: string[] = ["3amer", "salem", "3li", "salah", "mohamed", "khdija", "jilani"];
  selectedList: string[] = [];

  addToSelectedList(event: Event) {
    const selectedUser = (event.target as HTMLSelectElement).value;
    if (selectedUser && !this.selectedList.includes(selectedUser)) {
      this.selectedList.push(selectedUser);
    }
  }
  deleteFromSelectedList(user:string){
    this.selectedList = this.selectedList.filter(u => u !== user);
  }

}
