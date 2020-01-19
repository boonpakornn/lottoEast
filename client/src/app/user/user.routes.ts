import { ProfileComponent } from '../profile/profile.component'
import { LoginComponent } from '../login/login.component'
import { AddUserComponent } from '../add-user/add-user.component'

export const userRoutes = [
    {path: 'profile', component: ProfileComponent},
    {path: 'login', component: LoginComponent},
    {path: 'adduser', component: AddUserComponent}
]