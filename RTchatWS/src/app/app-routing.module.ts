import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {LandpageComponent} from './landpage/landpage.component';
import {ProjectsComponent} from './projects/projects.component';
import {AddProjectComponent} from './projects/add-project/add-project.component';
import {UpdateProjectComponent} from './projects/update-project/update-project.component';
import {TasksComponent} from './tasks/tasks.component';
import {AddtaskComponent} from './tasks/addtask/addtask.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [
  {path:'chat',component:ChatComponent},
  {path:'signup',component:SignupComponent},
  {path:'login',component:LoginComponent},
  {path:'',component:LandpageComponent},
  {path:'projects',component:ProjectsComponent},
  {path:'addProject',component:AddProjectComponent},
  {path: 'projects/update/:id', component: UpdateProjectComponent },
  {path:'tasks',component:TasksComponent},
  {path:'addtask',component:AddtaskComponent},
  {path:'dashboard',component:DashboardComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
