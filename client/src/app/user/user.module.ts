import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.routes';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProfileComponent } from '../profile/profile.component';
import { LoginComponent } from '../login/login.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { UserListComponent } from '../user-list/user-list.component';

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
        AddUserComponent,
        ChangePasswordComponent,
        UserListComponent
    ],
    providers: [

    ]
})
export class UserModule {

}
