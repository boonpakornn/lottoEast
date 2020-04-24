import { ProfileComponent } from '../profile/profile.component';
import { LoginComponent } from '../login/login.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { UserListComponent } from '../user-list/user-list.component';

import { AuthGuardService as AuthGuard} from '../service/auth-guard.service';

export const userRoutes = [
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'adduser', component: AddUserComponent, canActivate: [AuthGuard]},
    {path: 'changepassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},
    {path: 'user-list', component: UserListComponent, canActivate: [AuthGuard]}
];
