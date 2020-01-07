import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'report-app',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit{
  title = 'lottoEast';

  constructor(private http: HttpClient){

  }

  ngOnInit(): void{
    
  }
}
