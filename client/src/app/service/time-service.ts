import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class TimeService {
    private serverUrl = environment.serverUrl;
    public isAvailable;
    public startHour;
    public startMinute;
    public endHour;
    public endMinute;
    constructor( private http: HttpClient) {
    }


    initTime() {
        this.http.get<any>(this.serverUrl + '/init-time').subscribe(result => {
            console.log('init time', result);
        });
        setTimeout(() => {
            this.getTime();
        },
        700);
    }

    getTime() {
        this.http.get<any>(this.serverUrl + '/get-time').subscribe(result => {
            if (result.data.length > 0) {
                this.startHour = result.data[0].startHour;
                this.startMinute = result.data[0].startMinute;
                this.endHour = result.data[0].endHour;
                this.endMinute = result.data[0].endMinute;
            }
            else {
                this.initTime();
            }
        });
    }

    compareTime() {
        const startTime = new Date();
        startTime.setHours(this.startHour, this.startMinute, 0);
        const endTime = new Date();
        endTime.setHours(this.endHour, this.endMinute, 0);
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const currentTime = new Date();
        currentTime.setHours(currentHour, currentMinute, 0);

        if (startTime < currentTime && currentTime < endTime) {
        return true;
        }
        else {
        return false;
        }
    }

}
