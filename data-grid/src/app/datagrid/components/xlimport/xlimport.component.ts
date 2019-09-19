import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as XLSX from 'xlsx';
@Component({
  selector: 'olam-xlimport',
  templateUrl: './xlimport.component.html',
  styles: []
})
export class XlimportComponent implements OnInit {
  @Input('columns') columns: any[];
  @Input('header') header: string;
  @Output('onImportXl') onImportXl: EventEmitter<any> = new EventEmitter();
  public keyTitle: any;
  public data: any[] = [];
  constructor() { }
  

  generateTitleKey(){
    this.keyTitle = {};
    for (let j = 0; j < this.columns.length; j++) {
      this.keyTitle[this.columns[j]['title']] = this.columns[j]['field'];
    }
       
  }
  ngOnInit() {
    this.generateTitleKey();
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const jsonArr = JSON.parse(JSON.stringify(XLSX.utils.sheet_to_json(ws, {header: 1})));
     // console.log('dsgdsd', )
     if(this.header) {
       for ( let j=2; j<jsonArr.length; j++) {
         const obj = {};
         // console.log('444',JSON.parse(JSON.stringify(jsonArr[j])));
         const arr = JSON.parse(JSON.stringify(jsonArr[j]));
        for ( let k=0; k<arr.length; k++) {
          obj[this.keyTitle[jsonArr[1][k]]] = jsonArr[j][k];
        }
        // console.log('fgfg',obj);
        this.data.push(obj);
       }
     } else {
      for ( let j=1; j<jsonArr.length; j++) {
        const obj = {};
       for ( let k=0; k<jsonArr[j].length; j++) {
         obj[this.keyTitle[jsonArr[1][k]]] = jsonArr[j][k];
       }
       this.data.push(obj);
      }
     }
    // console.log('ssd',this.data);
     this.onImportXl.emit({data: this.data});
      /* save data */
      // this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
    };
    reader.readAsBinaryString(target.files[0]);
  }

}
