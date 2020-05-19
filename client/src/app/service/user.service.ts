import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  public addUser(data): any {
  this.http.post<any>(this.serverUrl + '/add-user', data).subscribe(result => {
    console.log('result', result);
    });
  }

  public deleteUser(data): any {
    this.http.post<any>(this.serverUrl + '/delete-user', data).subscribe(result => {
      console.log('result', result);
      });
  }
}
