import { Component } from '@angular/core'

@Component({
    selector: 'report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent {
    data = [{
        no: 1,
        bookNumber: 9999,
        countNumber: 42,
        groupNumber: 55,
        sender: 'Moo'
    }]

    displayedColumns: string[] = ['no', 'bookNumber', 'countNumber', 'groupNumber', 'sender', 'delete'];
    dataSource = this.data;
}