import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'olam-split',
  templateUrl: './split.component.html',
  styleUrls: ['./split.component.css']
})
export class SplitComponent implements OnInit {
  @Input('data') data: any[];
  @Input('columns') columns: any[];
  @Input('selectedRowIndexes') selectedRowIndexes: any[];
  @Input('splitBy') splitBy: string;
  @Output('onSplitEvt') onSplitEvt: EventEmitter<any> = new EventEmitter();
  public numberOfCopy: number;
  // public splitBy: string;
  constructor() { }

  ngOnInit() {
  }
  onSplit() {
    if (this.selectedRowIndexes.length > 0) {
        // console.log(this.splitBy, this.numberOfCopy, this.selectedRowIndexes);
        let tempArr;
        tempArr = [];
        for ( let j = 0; j < this.selectedRowIndexes.length; j++) {
          this.data[this.selectedRowIndexes[j]][this.splitBy] =  (this.data[this.selectedRowIndexes[j]][this.splitBy] / this.numberOfCopy);
          if (this.data[this.selectedRowIndexes[j]]['checked']) {
            delete this.data[this.selectedRowIndexes[j]]['checked'];
          }
          if (this.data[this.selectedRowIndexes[j]]['isCollapsed']) {
            delete this.data[this.selectedRowIndexes[j]]['isCollapsed'];
          }
          for (let k = 0; k < this.numberOfCopy; k++) {
            tempArr.push( this.data[this.selectedRowIndexes[j]]);
          }
        }
        console.log(this.numberOfCopy);
        for ( let j = 0; j < this.selectedRowIndexes.length; j++) {
          this.data.splice(this.selectedRowIndexes[j], 1);
        }
        this.onSplitEvt.emit({splittedData: tempArr, data: this.data});
    }
  }
}
