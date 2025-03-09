import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {RouterModule} from '@angular/router';
import { LandpageComponent } from './landpage/landpage.component';
import { ProjectsComponent } from './projects/projects.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import {FormsModule} from "@angular/forms";
import {AuthServiceService} from './services/auth-service.service';
import { provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { AddProjectComponent } from './projects/add-project/add-project.component';
import { UpdateProjectComponent } from './projects/update-project/update-project.component';
import { TasksComponent } from './tasks/tasks.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { AddtaskComponent } from './tasks/addtask/addtask.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    LandpageComponent,
    ProjectsComponent,
    SidebarComponent,
    AddProjectComponent,
    UpdateProjectComponent,
    TasksComponent,
    AddTaskComponent,
    AddtaskComponent,
    DashboardComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule.forRoot([]),
        FormsModule,

    ],
  providers: [    provideHttpClient() ],
  bootstrap: [AppComponent]
})
export class AppModule { }
