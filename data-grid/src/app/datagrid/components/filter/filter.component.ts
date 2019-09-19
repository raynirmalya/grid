import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'olam-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {
  @Input('field') field: string;
  @Input('data') data: any [];
  @Input('dataType') dataType: string;
  @Input('moreDataPresent') moreDataPresent: boolean;
  @Output('onFilter') onFilter: EventEmitter<any> = new EventEmitter();
  public copyOfUnfilteredData: any [];

  itemList = [];
  selectedItems = [];
  settings = {};



 // public copyOfData: any [];
  public filterBy: any;
  constructor() { }

  ngOnInit() {
    this.itemList = [];
    this.copyOfUnfilteredData = _.cloneDeep(this.data);
    this.selectedItems = [
      { "id": 1, "itemName": "India" },
      { "id": 2, "itemName": "Singapore" },
      { "id": 3, "itemName": "Australia" },
      { "id": 4, "itemName": "Canada" }];
    this.settings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2
    };


    
   // this.copyOfData = Object.assign([], JSON.parse(JSON.stringify(this.data)));
   if (!this.dataType) {
     this.dataType = 'string';
   } else {
     this.dataType = this.dataType.toLowerCase();
   }
   if(this.dataType === 'multiselect')  {
     this.generateMultiSelect();
   }
  }

  generateMultiSelect() {
    for( let j = 0; j<this.data.length; j++) {
      if(this.itemList.indexOf(this.data[j][this.field]) === -1){
        this.itemList.push({ id: this.data[j][this.field], itemName: this.data[j][this.field] });
      }
    }
  }
  filterData() {
    // console.log(this.data);
    if ( !this.moreDataPresent ) {
      // tslint:disable-next-line:max-line-length
      this.data = this.data.filter(x => x[this.field].toString().toLowerCase().indexOf(this.filterBy.trim().toString().toLowerCase()) !== -1);
    }
    // console.log(this.field, this.data, this.filterBy);
    this.onFilter.emit({originalEvent: event, data: this.data, filterBy: this.filterBy, unfilteredData: this.copyOfUnfilteredData});
  }
  clear() {
    this.filterBy = '';
    // this.data = this.copyOfData;
    this.data = _.cloneDeep(this.copyOfUnfilteredData);
    this.onFilter.emit({originalEvent: event, data: this.data, filterBy: this.filterBy, unfilteredData: this.copyOfUnfilteredData});
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
}
