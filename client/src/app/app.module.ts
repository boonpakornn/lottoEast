import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReportComponent } from './report.component';
import { ReportListComponent } from './report-list/report-list.component';
import { NavBarComponent } from './nav/navbar.component';
import { ResultComponent } from './result/result.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'

import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { appRoutes } from './routes'
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './user/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';


@NgModule({
  declarations: [
    ReportComponent,
    ReportListComponent,
    NavBarComponent,
    ResultComponent

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatToolbarModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, AuthGuardService],
  bootstrap: [ReportComponent]
})
export class AppModule { }
