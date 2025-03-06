import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskComponent } from './task/task.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {RouterModule} from '@angular/router';
import { LandpageComponent } from './landpage/landpage.component';
import { ProjectsComponent } from './projects/projects.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import {FormsModule} from "@angular/forms";
import {AuthServiceService} from './services/auth-service.service';
import {HttpClientModule, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { AddProjectComponent } from './projects/add-project/add-project.component';
import { UpdateProjectComponent } from './projects/update-project/update-project.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    SignupComponent,
    LoginComponent,
    LandpageComponent,
    ProjectsComponent,
    SidebarComponent,
    AddProjectComponent,
    UpdateProjectComponent,
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
