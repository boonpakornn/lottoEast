import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ProfileService } from '../service/profile.service';

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
