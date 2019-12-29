import { Component } from '@angular/core'

@Component({
    selector: 'report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent {
    data = [{
        id: 1,
        number: 9999,
        sender: 'Moo'
    }]

    displayedColumns: string[] = ['id', 'number', 'sender','delete'];
    dataSource = this.data;
}