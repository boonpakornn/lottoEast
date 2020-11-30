import { Routes } from '@angular/router';

import { ResultComponent } from './result/result.component';
import { ReportListComponent } from './report-list/report-list.component';
import { LottoListComponent } from './lotto-list/lotto-list.component';

import { AuthGuardService as AuthGuard } from './service/auth-guard.service';
import { TransferComponent } from './transfer/transfer.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/report', pathMatch: 'full', canActivate: [AuthGuard]},
    { path: 'report', component: ReportListComponent, canActivate: [AuthGuard]},
    { path: 'transfer', component: TransferComponent, canActivate: [AuthGuard]},
    { path: 'result', component: ResultComponent, canActivate: [AuthGuard]},
    { path: 'lotto-list', component: LottoListComponent, canActivate: [AuthGuard]},
    { path: 'user', loadChildren: './user/user.module#UserModule'}

];
