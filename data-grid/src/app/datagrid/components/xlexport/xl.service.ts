import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const CSV_TYPE = 'application/vnd.ms-excel;charset=utf-8';
const EXCEL_EXTENSION = '.xlsx';
const CSV_EXTENSION = '.csv';

@Injectable()
export class XlService {

  constructor() { }
  private increaseAlphanumeric(value) {
        value = value.replace(/(\d+)$/,  (match, n) => {
            return ++n; // parse to int and increment number
        });
        return value;
  }
  public exportAsExcelFile(json: any[], excelFileName: string, header: string, columnLen: number): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    let formatedExcelJson;
    formatedExcelJson = {};
    // console.log('header', header);
    if (header) {
      // console.log(worksheet);
      const keys = Object.keys(worksheet);
      columnLen = columnLen - 1;
      formatedExcelJson['A1'] = {t: 's', v: header, s: {'fill': {'bgColor': {'rgb': 'FFFF0000'}}}};
      formatedExcelJson['!merges'] = [{s: {r: 0, c: 0}, e: {r: 0, c: columnLen}}];
      const ref = worksheet['!ref'].split(':');
      for ( let i = 0; i < keys.length; i++ ) {
        formatedExcelJson[this.increaseAlphanumeric(keys[i])] = worksheet[keys[i]];
      }
      formatedExcelJson['!ref'] = ref[0] + ':' + this.increaseAlphanumeric(ref[1]);
      //  console.log(JSON.stringify(formatedExcelJson));
    } else {
      formatedExcelJson = worksheet;
    }
    const defaultCellStyle =  { font: { name: 'Verdana', sz: 11, color: 'FF00FF88'}, fill: {fgColor: {rgb: 'FFFFAA00'}}};
    const workbook: XLSX.WorkBook = { Sheets: { 'data': formatedExcelJson }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportAsCsvFile(json: any[], excelFileName: string, header: string, columnLen: number): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    this.saveAsCsvFile(worksheet, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  private saveAsCsvFile(worksheet: any, fileName: string) {
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], {type: CSV_TYPE});
    FileSaver.saveAs(blob, fileName + new Date().getTime() + CSV_EXTENSION);
  }

}
