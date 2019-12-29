import { Component } from '@angular/core'

@Component({
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent {
    data = [{
        no: 1,
        bookNumber: 9999,
        countNumber: 42,
        groupNumber: 55,
        sender: 'Moo'
    }]

    displayedColumns: string[] = ['no', 'bookNumber', 'countNumber', 'groupNumber', 'sender'];
    dataSource = this.data;
}