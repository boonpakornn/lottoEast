import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.routes';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProfileComponent } from '../profile/profile.component';
import { LoginComponent } from '../login/login.component';
import { AddUserComponent } from '../add-user/add-user.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(userRoutes)
    ],
    declarations: [
        ProfileComponent,
        LoginComponent,
        AddUserComponent
    ],
    providers: [

    ]
})
export class UserModule {

}
