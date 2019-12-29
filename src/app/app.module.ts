import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReportComponent } from './report.component';
import { ReportListComponent } from './report/report-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    ReportComponent,
    ReportListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [ReportComponent]
})
export class AppModule { }
