import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LottoService {
  private serverUrl = environment.serverUrl;

  public loggedinUser = this.authService.currentUser.userName;
  public currentUser = { currentUser: this.loggedinUser, status: 'True'};

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  public updateLotto(data): any {
    this.http.post<any>(this.serverUrl + '/update-lotto', data).subscribe(result => {
      console.log('update', result);
  });
  }

  public updateSetLotto(bookNumber, countNumber, group): any {
    this.http.post<any>(this.serverUrl + '/update-set-lotto', {bookNumber, countNumber, group}).subscribe(result => {
      console.log('update-set', result);
  });
  }

  public updateAllLottoToFalse(): any {
    this.http.post<any>(this.serverUrl + '/update-lotto-all-false', {}).subscribe(result => {
      console.log('all-false', result);
  });
  }

  public deleteAllLotto(): any {
    this.http.post<any>(this.serverUrl + '/deleteall-lotto', {}).subscribe(result => {
      console.log('delete-all', result);
  });
  }

  public addLotto(data): any {
    this.http.post<any>(this.serverUrl + '/add-lotto', data).subscribe(result => {
      console.log('add', result);
    });
  }

  public deleteLotto(data): any {
    this.http.post<any>(this.serverUrl + '/delete-lotto', data).subscribe(result => {
      console.log('delete', result);
  });
  }
}
