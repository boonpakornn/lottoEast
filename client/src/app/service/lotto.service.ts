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

  public updateAllLottoToFalse(): any {
    this.http.post<any>(this.serverUrl + '/update-lotto-all-false', {}).subscribe(result => {
      console.log('allfalse', result);
  });
  }

  public deleteAllLotto(): any {
    this.http.post<any>(this.serverUrl + '/deleteall-lotto', {}).subscribe(result => {
      console.log('deleteall', result);
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
