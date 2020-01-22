import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { AuthService } from '../user/auth.service';

@Component({
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    resultList: any;
    public loggedinUser = this.authService.currentUser.userName;
    public currentUser = { currentUser: this.loggedinUser, status: 'True'};
    ngOnInit() {
        this.loadResultList();
    }

    loadResultList() {
        this.http.post<any>('http://localhost:3000/get-result-lotto', this.currentUser).subscribe(result => {
            this.resultList = result.data;
        });
    }
}
