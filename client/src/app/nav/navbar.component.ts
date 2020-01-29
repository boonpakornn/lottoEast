import { Component } from '@angular/core';
import { AuthService } from '../user/auth.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavBarComponent {

    constructor(public auth: AuthService) {

    }

    logOut() {
        this.auth.logout();
    }


}
