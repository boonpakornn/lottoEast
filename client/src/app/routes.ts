import { Routes } from '@angular/router' 

import { ResultComponent } from './result/result.component';
import { ReportListComponent } from './report-list/report-list.component';

export const appRoutes:Routes = [
    { path: '', redirectTo: '/report', pathMatch: 'full'},
    { path: 'report', component: ReportListComponent},
    { path: 'result', component: ResultComponent}
    
]
