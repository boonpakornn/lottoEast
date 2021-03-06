import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReportComponent } from './report.component';
import { ReportListComponent } from './report-list/report-list.component';
import { NavBarComponent } from './nav/navbar.component';
import { ResultComponent } from './result/result.component';
import { TransferComponent } from './transfer/transfer.component';
import { LottoListComponent } from './lotto-list/lotto-list.component';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgxSpinnerModule } from 'ngx-spinner';

import { appRoutes } from './routes';

import { AuthService } from './service/auth.service';
import { AuthGuardService } from './service/auth-guard.service';
import { TimeService } from './service/time-service';
import { ProfileService } from './service/profile.service';
import { LottoService } from './service/lotto.service';
import { UserService } from './service/user.service';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';


@NgModule({

  declarations: [
    ReportComponent,
    ReportListComponent,
    NavBarComponent,
    ResultComponent,
    TransferComponent,
    LottoListComponent
  ],
  entryComponents: [
    ReportListComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatToolbarModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    NgbModalModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTableExporterModule,
    NgxSpinnerModule
  ],
  providers: [
    AuthService,
    AuthGuardService,
    TimeService,
    ProfileService,
    LottoService,
    UserService
  ],
  bootstrap: [ReportComponent]
})
export class AppModule { }
