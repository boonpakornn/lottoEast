import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class TimeService{
    public isAvailable;
    public startHour;
    public startMinute;
    public endHour;
    public endMinute;
    constructor( private http: HttpClient) {
    }


    initTime() {
        this.http.get<any>('http://localhost:3000/init-time').subscribe(result => {
            console.log('init time', result);
        });
        setTimeout(() => {
            this.getTime();
        },
        700);
    }

    getTime() {
        this.http.get<any>('http://localhost:3000/get-time').subscribe(result => {
            if (result.data.length > 0) {
                this.startHour = result.data[0].startHour;
                this.startMinute = result.data[0].startMinute;
                this.endHour = result.data[0].endHour;
                this.endMinute = result.data[0].endMinute;
            }
            else {
                this.initTime();
            }

            this.compareTime();
        });
    }

    compareTime() {
        const startTime = this.startHour + ':' + this.startMinute + ':00';
        const endTime =  this.endHour + ':' + this.endMinute + ':00';
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const currentTime = currentHour + ':' + currentMinute + ':00';
        if (startTime > currentTime && currentTime < endTime) {
        this.isAvailable = true;
        }
        else {
        this.isAvailable = false;
        }
    }

}
