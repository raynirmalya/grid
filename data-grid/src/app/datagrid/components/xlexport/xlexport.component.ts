import { Component, OnInit, HostListener, Input } from '@angular/core';
import { XlService } from './xl.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'olam-xlexport',
  templateUrl: './xlexport.component.html',
  styleUrls: ['./xlexport.component.css']
})
export class XlexportComponent implements OnInit {
  @Input('fileType') fileType: string; // csv | excel
  @Input('exportType') exportType: string; // tempalate | all
  @Input('data') data: any[];
  @Input('fileName') fileName: string;
  @Input('header') header: string;
  @Input('columns') columns: any[];
  public defaultFileName = 'File';
  public exData: any[] = [];
  constructor(private xlService: XlService) { }

  ngOnInit() {
  }
  templateExport() {
    if (this.exData.length > 0) {
      this.exData = this.exData.slice(0, 1);
      const keys = Object.keys(this.exData[0]);
      for ( let i = 0; i < keys.length; i++ ) {
        this.exData[0][keys[i]] = '';
      }
    }
  }
  formatData() {
    let tempData;
    tempData = [];
    for ( let i = 0; i < this.exData.length; i++ ) {
      if (this.columns) {
        const obj = {};
        for (let j = 0; j < this.columns.length; j++) {
          obj[this.columns[j]['title']] = this.exData[i][this.columns[j]['field']];
        }
         tempData.push(obj);
      }
      if (this.exData[i]['checked']) {
        delete this.exData[i]['checked'];
      }
      if (this.exData[i]['isCollapsed']) {
        delete this.exData[i]['isCollapsed'];
      }
    }
    if (tempData.length > 0) {
      this.exData = tempData;
    }
  }
  @HostListener('click', ['$event'])
  onClick(e) {
    this.exData = Object.assign([], JSON.parse(JSON.stringify(this.data)));
    this.formatData();
    if (this.exportType && this.exportType.toString().toLocaleLowerCase() === 'template') {
      this.templateExport();
    }
    if (!this.fileName) {
       if (this.fileType && this.fileType.toString().toLocaleLowerCase() === 'csv') {
          this.xlService.exportAsCsvFile(this.exData, this.defaultFileName, this.header, this.columns.length);
       } else {
         this.xlService.exportAsExcelFile(this.exData, this.defaultFileName, this.header, this.columns.length);
       }
    } else {
       if (this.fileType && this.fileType.toString().toLocaleLowerCase() === 'csv') {
          this.xlService.exportAsCsvFile(this.exData, this.fileName, this.header, this.columns.length);
       } else {
         this.xlService.exportAsExcelFile(this.exData, this.fileName, this.header, this.columns.length);
       }
    }
  }
}
