import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-update-project',
  standalone: false,
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.css'
})
export class UpdateProjectComponent implements OnInit {
  projectId: any;
  projectToUpdate: any = {};

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;

    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      this.projectToUpdate = project;
    });
  }

  updateProject(): void {
    this.projectService.updateProject(this.projectId, this.projectToUpdate).subscribe(
      (response) => {
        console.log('Project updated:', response);
        this.router.navigate(['/projects']);
      },
      (error) => {
        console.error('Error updating project:', error);
      }
    );
  }
}

