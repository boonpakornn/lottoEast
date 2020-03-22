import { Component } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { ProfileService } from '../profile/profile.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavBarComponent {

    constructor(public auth: AuthService,
                public profileService: ProfileService) {

    }

    logOut() {
        this.auth.logout();
    }

    validateUser() {
        this.profileService.isCurrentUser = true;
    }

}
