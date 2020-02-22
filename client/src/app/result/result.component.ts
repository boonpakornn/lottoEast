import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../user/auth.service';
import { environment } from '../../environments/environment';
import { NumberValueAccessor } from '@angular/forms';

@Component({
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
    private serverUrl = environment.serverUrl;

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }
    numberOfLotto: number;
    resultList: any;
    public loggedinUser = this.authService.currentUser.userName;
    public currentUser = { currentUser: this.loggedinUser, status: 'True'};
    ngOnInit() {
        this.loadResultList();
    }

    loadResultList() {
        this.http.post<any>(this.serverUrl + '/get-result-lotto', this.currentUser).subscribe(result => {
            this.resultList = result.data;
            this.numberOfLotto = this.resultList.length;
        });
    }
}
