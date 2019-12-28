import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReportComponent } from './report.component';

@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [ReportComponent]
})
export class AppModule { }
