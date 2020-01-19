import { ProfileComponent } from '../profile/profile.component'
import { LoginComponent } from '../login/login.component'
import { AddUserComponent } from '../add-user/add-user.component'
import { AuthGuardService as AuthGuard }  from '../auth/auth-guard.service';


export const userRoutes = [
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'adduser', component: AddUserComponent, canActivate: [AuthGuard]}
]