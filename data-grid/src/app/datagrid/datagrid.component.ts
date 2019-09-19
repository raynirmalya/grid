// tslint:disable-next-line:max-line-length
import { ViewChild, Component, EventEmitter, OnInit, Input, ContentChildren, QueryList, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy, TemplateRef, ViewEncapsulation, Output, NgModule, OnChanges, AUTO_STYLE, ElementRef, DoCheck, IterableDiffers } from '@angular/core';
import { GridcolumnComponent } from './components/gridcolumn/gridcolumn.component';
import { Subscription } from 'rxjs/Subscription';
import { RowExpansionTemplateDirective } from './templates/row-expansion.directive';
import { Pagination, ColumnConfig, ToolbarButtons, CallbackData, OnSortCallbackData, OnFilterCallbackData, OnRowSelectCallbackData } from './datagrid.model';
import { HeaderTemplateDirective } from './templates/header-template.directive';
import { FooterTemplateDirective } from './templates/footer-template.directive';
import { EditTemplateDirective } from './templates/edit-template.directive';
import { BodyTemplateDirective } from './templates/body-template.directive';
import { HeaderTemplateLoader } from './templates/header-tmpl-loader.component';
import { EditTemplateLoader } from './templates/edit-tmpl-loader.component';
import { BodyTemplateLoader } from './templates/body-tmpl-loader.component';
import { RowExpansionTemplateLoader } from './templates/row-exp-tmpl-loader.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XlexportComponent } from './components/xlexport/xlexport.component';
import { XlService } from './components/xlexport/xl.service';
import { FilterComponent } from './components/filter/filter.component';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { SplitComponent } from './components/split/split.component';
import { ModalModule, ModalDirective } from 'ngx-bootstrap';
import { McolTemplateLoader } from './templates/mcol-tmpl-loader.component';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../confirm-box/confirm.service';
import { OlamMultiSelectModule } from '../multiselect/multiselect.component';
import { McolHeaderTemplateLoader } from './templates/mcolh-tmpl-loader.component';
import { XlimportComponent } from './components/xlimport/xlimport.component';
import { OlamSingleSelectModule } from '../singleselect/singleselect.component';
import { ActionColTemplateLoader } from './templates/action-col-temp-loader.component';
import { ActionColTemplateDirective } from './templates/action-col-temp.directive';
import { ToolbarActionTemplateDirective } from './templates/toolbar-action-temp.directive';
import { ToolbarActionTemplateLoader } from './templates/toolbar-action-temp-loader.component';
import { trigger, state, transition, animate, style } from '@angular/core';
import { Animation } from '@angular/animations/browser/src/dsl/animation';
import { StickyDirective } from './directives/sticky.directive';
import { WindowRef } from './window.services';
import { ResponsiveDirective } from './directives/responsive.directive';
import * as _ from 'lodash';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export class Animations {
  public static easeInOut =
trigger('rowEaseInOut', [
  state('in', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translateX(-100px)'
    }),
    animate(300)
  ]),
  transition('* => void', [
    animate(300, style({
      transform: 'translateX(100px)',
      opacity: 0
    }))
  ])
]);

public static expandCollpase = trigger('expandCollpase', [
  state('inactive', style({ height: '0' })),
  state('active', style({ height: '*'  })),
  transition('active => inactive', animate('500ms ease-out')),
  transition('inactive => active', animate('1500ms ease-in'))
]);

}
export enum SortingStatus {
    NORMAL = 0 ,
    ASC = 1,
    DESC = 2,
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'olam-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [ 
    Animations.easeInOut,
    Animations.expandCollpase
   ]
})
export class DatagridComponent  implements AfterViewChecked, AfterViewInit, AfterContentInit, OnInit, OnChanges, OnDestroy {
  @Input('gridData') gridData: any[];
  @Input('editable') editable: boolean;
  @Input('rowExpansion') rowExpansion: boolean;
  @Input('colExpansion') colExpansion: boolean;
  @Input('maxColumn') maxColumn: number;
  @Input('draggable') draggable: boolean;
  // tslint:disable-next-line:no-input-rename
  // @Input('columnConfig') columnConfig: ColumnConfig[];
  private _data = new BehaviorSubject<ColumnConfig[]>([]);
  @Input()
  set columnConfig(value) {
      // set the latest value for _data BehaviorSubject
      this._data.next(value);
  };

  get columnConfig() {
      // get the latest value from _data BehaviorSubject
      return this._data.getValue();
  }



  @Input('toolbar') toolbar: boolean;
  // tslint:disable-next-line:no-input-rename
  @Input('toolbarButtons') toolBarBtns: ToolbarButtons;
  @Input('selectionColumn') selectionColumn: any;
  @Input('sortable') sortable: boolean;
  @Input('defaultSortColumn') defaultSortColumn: boolean;
  @Input('moreDataPresent') moreDataPresent: boolean;
  @Input('pagination') pagination: Pagination;
  @Input('rowExpansionCol') rowExpansionCol: boolean;
  @Input('excelHeader') excelHeader: string;
  @Input('exportFileName') exportFileName: string;
  @Input('splitColumn') splitColumn: string;
  @Input('noCopyCols') noCopyCols: string [];
  @Output('onShowMoreEvt') onShowMoreEvt: EventEmitter<CallbackData> = new EventEmitter();
  @Output('onFilterEvt') onFilterEvt: EventEmitter<OnFilterCallbackData> = new EventEmitter();
  @Output('onAddEvt') onAddEvt: EventEmitter<CallbackData> = new EventEmitter();
  @Output('onCopyEvt') onCopyEvt: EventEmitter<CallbackData> = new EventEmitter();
  @Output('onRefreshEvt') onRefreshEvt: EventEmitter<CallbackData> = new EventEmitter();
  @Output('onDeleteEvt') onDeleteEvt: EventEmitter<CallbackData> = new EventEmitter();
  @Output('onBulkSaveEvt') onBulkSaveEvt: EventEmitter<CallbackData> = new EventEmitter();
  @Output('onSortEvt') onSortEvt: EventEmitter<OnSortCallbackData> = new EventEmitter();
  @Output('onRowSelectEvt') onRowSelectEvt: EventEmitter<OnRowSelectCallbackData> = new EventEmitter();
  @ContentChildren(GridcolumnComponent) cols: QueryList<GridcolumnComponent>;
  @ContentChildren(RowExpansionTemplateDirective) reTemplates: QueryList<RowExpansionTemplateDirective>;
  @ContentChildren(ToolbarActionTemplateDirective) taTemplates: QueryList<ToolbarActionTemplateDirective>;
  @ViewChild('showModal') public showModal: ModalDirective;
  public rowExpTemplate: TemplateRef<any>;
  public toolbarActionTemplate: any = {};
  public colSubscription: Subscription;
  public columns: GridcolumnComponent[];
  public copyOfGridData: any[];
  public initialGridData: any[];
  public allItemsChecked = false;
  public tempMinColumn: number;
  public isColumnExpanded = false;
  public allfields: string[] = [];
  public selectedRowIndexes: number[] = [];
  public notHiddenColCount = 0;
  public tempIndex = 0;
  public dynamicfields: string[] = [];
  public sortingColStatus = {};
  public selectedRows: any[] = [];
  public sortingStatus: typeof SortingStatus = SortingStatus;
  public MAX_COLUMN_SHOWN = 9;
  public MIN_ROW = 5;
  public primaryColumns: any [];
public filterable = false;
  public gridId: string;
  public mandatoryColumns: any [];
  public columnInGroups: any [];
  public actionCols: any[];
  public differ: any;
  public previousColumnConfig: ColumnConfig[];
  public copyOfColumnConfig: ColumnConfig[];
  public iconBefore: string;
  private columnConfigSubject: Observable<ColumnConfig[]>;
  public srcIndex = -1;
  public destIndex = -1;
  
  constructor(public confirmationService: ConfirmationService, public el: ElementRef) {
   
  }

  bootstrapGrid() {
    this.initColumns();
    this.getAllfields();
    this.getAllDynamicfields();
    console.log("+++++++++++");
    this.copyOfGridData = _.cloneDeep(this.gridData);
    this.reTemplates.forEach((item) => {
      this.rowExpTemplate = item.template;
    });
    this.taTemplates.forEach((item) => {
      console.log(item);
      this.iconBefore = item.before;
      if(!this.iconBefore){
        this.iconBefore = 'last';
      }
      this.toolbarActionTemplate[this.iconBefore] = item.template;
    });
  }

  
  /*ngDoCheck() {
    if (!_.isEqual(this.columnConfig, this.previousColumnConfig)) {
      this.previousColumnConfig = _.cloneDeep(this.columnConfig);
      this.bootstrapGrid();
      console.log('1');
    }    
    // console.log(change);
    // here you can do what you want on array change
    // you can check for forEachAddedItem or forEachRemovedItem on change object to see the added/removed items
    // Attention: ngDoCheck() is triggered at each binded variable on componenet; if you have more than one in your component, make sure you filter here the one you want.
  }*/
  ngOnInit() {
    this.gridId = this.guid();
    this.previousColumnConfig = _.cloneDeep(this.columnConfig);
    this.copyOfColumnConfig =_.cloneDeep(this.columnConfig);
    // this.columnConfigSubject = Observable.create((observer: Observer<ColumnConfig[]>) => {
    //   console.log('~~~~~here',this.columnConfig);
    //   observer.next(this.columnConfig);
    // })
   // this.columnConfigSubject = new BehaviorSubject<ColumnConfig[]>().asObservable();
    this._data.subscribe( (data:ColumnConfig[])=>{
       console.log('++++++', data); 
      if(data && data.length>0) {
       console.log('~~~~~', data); 
       this.previousColumnConfig = _.cloneDeep(data);
       this.bootstrapGrid();
      }
     })
  }
  randomStr() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  guid() {
      return this.randomStr() + this.randomStr() + '-' + this.randomStr() + '-' + this.randomStr() + '-' +
        this.randomStr() + '-' + this.randomStr() + this.randomStr() + this.randomStr();
  }
  animationStarts($event){
    console.log($event);
  }
  setToolBarConfig() {
    if (this.toolbar === null || this.toolbar === undefined) {
      this.toolbar = true;
    }
    if (!this.toolBarBtns) {
      this.toolBarBtns = {};
      this.toolBarBtns.save = false;
      this.toolBarBtns.add = true;
      this.toolBarBtns.addMultiple = true;
      this.toolBarBtns.refresh = true;
      this.toolBarBtns.copy = true;
      this.toolBarBtns.delete = true;
      this.toolBarBtns.filterable = false;
      this.toolBarBtns.splitable =  false;
      this.toolBarBtns.excelExport = false;
      this.toolBarBtns.csvExport = false;
      this.toolBarBtns.selectedExport = false;
      this.toolBarBtns.template =  false;
      this.toolBarBtns.excelImport =  false;
    } else {
      if (this.toolBarBtns.save === undefined) {
         this.toolBarBtns.save = false;
      }
      if (this.toolBarBtns.add === undefined) {
        this.toolBarBtns.add = true;
      }
      if (this.toolBarBtns.addMultiple === undefined) {
         this.toolBarBtns.addMultiple = true;
      }
      if (this.toolBarBtns.refresh === undefined) {
        this.toolBarBtns.refresh = false;
      }
      if (this.toolBarBtns.copy === undefined) {
        this.toolBarBtns.copy = false;
      }
      if (this.toolBarBtns.delete === undefined) {
        this.toolBarBtns.delete = true;
      }
      if (this.toolBarBtns.filterable === undefined) {
        this.toolBarBtns.filterable = false;
      }
      if (this.toolBarBtns.splitable === undefined) {
        this.toolBarBtns.splitable = false;
      }
      if (this.toolBarBtns.excelImport === undefined) {
        this.toolBarBtns.excelImport = false;
      }
      if (this.colExpansion === undefined) {
         this.toolBarBtns.colExpand = false;
      } else  {
         this.toolBarBtns.colExpand = this.colExpansion;
      }
      if (this.selectionColumn && this.selectionColumn.all === undefined) {
        this.selectionColumn = {};
        this.selectionColumn.all = true;
      }
      if (this.colExpansion && this.maxColumn === undefined) {
        this.maxColumn = this.MAX_COLUMN_SHOWN;
         this.tempMinColumn = this.MAX_COLUMN_SHOWN;
      }  else if (this.colExpansion) {
        this.tempMinColumn = this.maxColumn;
      }
    }
  }
  initColumns(): void {
      if (this.columnConfig) {
        // this.columns = this.columnConfig;
        const cols = this.cols.toArray();
        console.log("~~~~~", cols);
        let tempArr, tempCols;
        tempArr = [];
        tempCols = [];
        for ( let i = 0; i < this.columnConfig.length ; i++) {
          let obj;
          obj = cols.filter(x => x.field === this.columnConfig[i].field)[0];
         // console.log(this.gridId, cols, obj, this.columnConfig, this.columnConfig[i].dataType);
          if ( obj && this.columnConfig[i]) {
            if (!this.columnConfig[i].dataType) {
              obj.dataType = 'string';
            } else {
              obj.dataType = this.columnConfig[i].dataType;
            }
            obj.title = this.columnConfig[i].title;
            tempArr.push(obj);
            tempCols.push(obj.field);
          }
        }
        this.columns = tempArr;
        this.mandatoryColumns = [];
        this.actionCols = [];
        this.columnInGroups = [];
        
        for ( let i = 0; i < cols.length ; i++) {
          // console.log(cols[i].field, tempCols.indexOf(cols[i].field));
          if(cols[i].actionColTemplate) {
            this.actionCols.push(cols[i]);
          } else if (tempCols.indexOf(cols[i].field) === -1 && !cols[i].actionColTemplate) {
            if(cols[i].colGrouping == null){
              cols[i].colGrouping = -999;
            }  
            this.mandatoryColumns.push(cols[i]);
          }
        }
        let tempGroupArr = [];
        let k = 0;
        let r = -1;
        for(let j=0; j<this.mandatoryColumns.length; j++) {
          if ( k%3 === 0 ) {
            this.columnInGroups.push([]);
            r++;
          }
          if(this.mandatoryColumns[j].colGrouping === -999) {
            if(this.columnInGroups[this.columnInGroups.length-1]) {
              this.columnInGroups[this.columnInGroups.length-1].push(this.mandatoryColumns[j]);
            }
            
            // this.columnInGroups[r][this.columnInGroups[r].length-1].push(this.mandatoryColumns[j]);
            k++;
          } else if(tempGroupArr.indexOf(this.mandatoryColumns[j].colGrouping)=== -1){
            const arr=this.mandatoryColumns.filter(x => x.colGrouping === this.mandatoryColumns[j].colGrouping);
            if(arr.length > 0){
              tempGroupArr.push(arr[0].colGrouping);
              this.columnInGroups[this.columnInGroups.length-1].push(arr);
            }
            k++;
          } else {
            console.log("tempGroupArr", k, j);
            this.columnInGroups.splice(r,1);
          }
          
        }
        console.log('++++^^^^', this.columnInGroups)
        // for(let j=0; j<this.mandatoryColumns.length; j++) {
        //    if ( j%3 === 0 ) {
        //       this.columnInGroups.push([]);
        //    }
        //    this.columnInGroups[this.columnInGroups.length-1].push(this.mandatoryColumns[j]);
        // }
        
        console.log('111', tempCols, this.mandatoryColumns,this.columnInGroups);
      } else {
        this.columns = this.cols.toArray();
      }
      this.setToolBarConfig();
      if ( this.colExpansion ) {
        this.setPrimaryColumns();
      }
      // console.log(this.columns);
      if (!this.pagination) {
       // this.pagination = new Pagination(this.gridData.length, 1);
      }
      // console.log(this.pagination);
  }

  setPrimaryColumns() {
        this.primaryColumns = [];
        for ( let i  = 0; i < this.maxColumn; i++) {
          if ( this.columns[i] && this.columns[i].field ) {
             this.primaryColumns.push(this.columns[i].field);
          }
        }
  }

  keysort(key, sortType) {
    const that = this;
    return function(a, b) {
       // tslint:disable-next-line:no-bitwise
       return (+sortType === +that.sortingStatus.DESC) ? ~~(b[key] > a[key]) : ~~(a[key] > b[key]);
    };
  }
  ngOnChanges(changes: SimpleChanges) {
   // this.copyOfGridData = _.cloneDeep(this.gridData);
  }

  resetGrid() {
    for(let i=0;i<this.initialGridData.length; i++) {
      if(this.initialGridData[i].checked) {
        this.initialGridData[i].checked = false;
      }
    }
    this.selectedRowIndexes = [];
    this.selectedRows = [];
    console.log('~~~~', this.resetGrid, this.gridData);
    this.gridData = this.initialGridData;
  }
  ngAfterContentInit() {
    this.bootstrapGrid();
    this.initialGridData = _.cloneDeep(this.gridData); 
  }

  ngOnDestroy() {
    if (this.colSubscription) {
      this.colSubscription.unsubscribe();
    }
  }
  ngAfterViewChecked() {

  }

  ngAfterViewInit() {

  }

  onRefresh() {
    this.gridData =  _.cloneDeep(this.copyOfGridData);
    this.pagination = {maxRow: this.MIN_ROW, pageNumber: 1};
    this.onRefreshEvt.emit({originalEvent: event, data: this.gridData, pagination: this.pagination});
  }
  onCopy() {
    this.selectedRowIndexes.sort(function(a, b) { return a - b; });
    let tempArr;
    tempArr = [];
    for ( let i = 0; i < this.selectedRowIndexes.length; i++ ) {
      let obj;
      obj = _.cloneDeep(this.gridData[this.selectedRowIndexes[i]]);
      const arr = Object.keys(obj);
      for ( let j = 0;j < arr.length; j++) {
        if(this.noCopyCols && this.noCopyCols.indexOf(arr[i]) > -1) {
           obj[arr[j]] = null;
        }
      }      
      obj.checked = false;
      obj.isCollapsed = false;
      tempArr.push(obj);
    }
    // console.log("~~~~", tempArr);
    this.gridData = this.gridData.concat(tempArr);
    this.allItemsChecked =  false;
    this.onCopyEvt.emit({originalEvent: event, data: this.gridData, pagination: this.pagination});
  }
  onSave() {
    this.onBulkSaveEvt.emit({originalEvent: event, data: this.gridData, pagination: this.pagination});
  }
  onDelete() {
      this.confirmationService.confirm({
        message: 'Confirm.Common.DeleteMultiple',
        accept: (event) => {
          this.selectedRowIndexes.sort(function(a, b) { return b - a; });
          let deletedRows;
          deletedRows = [];
          for ( let i = 0; i < this.selectedRowIndexes.length; i++) {
              deletedRows.push(this.gridData[this.selectedRowIndexes[i]]);
              this.gridData.splice(this.selectedRowIndexes[i], 1);
          }
          this.selectedRowIndexes = [];
          this.selectedRows = [];
          if (this.gridData.length < 1)  {
            this.gridData.push({});
          }
          this.allItemsChecked =  false;
          this.onDeleteEvt.emit({originalEvent: event, data: deletedRows, pagination: this.pagination});
        },
        reject: (event) => {
        }
    });
  }
  getAllfields() {
    this.allfields = [];
    for (let i = 0; i < this.columns.length; i++ ) {
      this.allfields.push(this.columns[i].field);
    }
  }
  getAllDynamicfields() {
    this.dynamicfields = [];
    this.sortingColStatus = {};
    if (this.columnConfig) {
      for (let i = 0; i < this.columnConfig.length; i++ ) {
        this.dynamicfields.push(this.columnConfig[i].field);
        this.sortingColStatus[this.columnConfig[i].field] = this.sortingStatus.NORMAL ;
      }
    }
  }
  onAddNew() {
    if (this.toolBarBtns.addMultiple) {
       this.gridData.unshift({});
      // this.gridData.push({});
    } else {
      const topRow = this.gridData[0];
      let isFilled: boolean;
      isFilled = false;
      for ( let j = 0; j < this.allfields.length; j++ ) {
        if (topRow[this.allfields[j]]) {
            isFilled = true;
        }
      }
      if (isFilled) {
        this.gridData.unshift({});
       // this.gridData.push({});
      }
    }
    this.onAddEvt.emit({originalEvent: event, data: this.gridData, pagination: this.pagination});
  }
  onColumnExpand() {
    if (!this.isColumnExpanded) {
      this.maxColumn = this.columns.length;
    } else {
      this.maxColumn = this.tempMinColumn;
    }
    this.setPrimaryColumns();
    this.isColumnExpanded = !this.isColumnExpanded;
  }

  dynamicHideColumns(col, rindex) {
    let isHide = false;
    if (this.columnConfig) {
      if (this.dynamicfields.indexOf(col.field)  > -1) {
        if ( this.colExpansion ) {
          if (this.primaryColumns.indexOf(col.field)  > -1) {
            isHide = false;
          } else {
            isHide = true;
          }
        } else {
           isHide = false;
        }
        return isHide;
      } else {
        isHide = true;
        return isHide;
      }
    } else {
      if ( this.colExpansion ) {
        if (this.primaryColumns.indexOf(col.field)  > -1) {
          isHide = false;
        } else {
          isHide = true;
        }
      } else {
          isHide = false;
      }
      return isHide;
    }
  }

  checkAllClicked(e) {
      if (e.target.checked) {
          this.allItemsChecked = true;
          for (let i = 0; i < this.gridData.length; i++) {
              this.gridData[i].checked = true;
              if (this.selectedRowIndexes.indexOf(i) === -1) {
                this.selectedRowIndexes.push(i);
                this.selectedRows.push(this.gridData[i]);
              }
          }
      } else {
          this.allItemsChecked = false;
          for (let i = 0; i < this.gridData.length; i++) {
              this.gridData[i].checked = false;
          }
           this.selectedRowIndexes = [];
           this.selectedRows = [];
      }
  }
  selectUnSelectAllChecked(e, index) {
      if (!e.target.checked) {
        this.allItemsChecked = false;
        const i = this.selectedRowIndexes.indexOf(index);
        if (i > -1) {
            this.selectedRowIndexes.splice(i, 1);
             this.selectedRows.splice(i, 1);
        }
        this.onRowSelectEvt.emit({originalEvent: event, data: this.gridData, pagination: this.pagination,
        selectedIndex: this.selectedRowIndexes, selectedRows: this.selectedRows,
        currentSelection: null});
      } else  {
          if (this.selectedRowIndexes.indexOf(index) === -1) {
            this.selectedRowIndexes.push(index);
            this.selectedRows.push(this.gridData[index]);
          }
         let selected;
          selected = 0;
          for (let i = 0; i < this.gridData.length; i++) {
              if ( !this.gridData[i].checked ) {
                this.allItemsChecked = false;
                break;
              } else {
                selected++;
              }
          }
          if ( selected === this.gridData.length ) {
            this.allItemsChecked = true;
          }
          this.onRowSelectEvt.emit({originalEvent: event, data: this.gridData, pagination: this.pagination,
            selectedIndex: this.selectedRowIndexes, selectedRows: this.selectedRows,
            currentSelection: this.gridData[index]});
      }
   }

   sortColumn(field, $event) {
     if ($event.currentTarget === $event.target && this.sortable) {
          const keys = Object.keys(this.sortingColStatus);
          for ( let i = 0; i < keys.length; i++ ) {
            if (field !== keys[i]) {
              this.sortingColStatus[keys[i]] = this.sortingStatus.NORMAL;
            }
          }
          if ( +this.sortingColStatus[field] === +this.sortingStatus.NORMAL) {
           this.copyOfGridData = _.cloneDeep(this.gridData);
          }
          if (this.sortingColStatus[field] === this.sortingStatus.DESC) {
            this.sortingColStatus[field] = this.sortingStatus.NORMAL;
          } else {
            this.sortingColStatus[field] = this.sortingColStatus[field] + 1;
          }
          if ( +this.sortingColStatus[field] === +this.sortingStatus.NORMAL) {
            this.gridData = _.cloneDeep(this.copyOfGridData);
          } else {
          if(!this.moreDataPresent){
            this.gridData.sort(this.keysort(field, this.sortingColStatus[field]));
          }
          this.onSortEvt.emit({originalEvent: event, field: field, status: this.sortingColStatus[field]});
          
        }
     }
   }
   hideNonExpanedColumns (index) {
      if (this.tempIndex !== index) {
      //  this.notHiddenColCount = 0;
      }
      // this.tempIndex = index;
      return  !this.maxColumn || (this.notHiddenColCount + 1 <= this.maxColumn);
   }

   showMore(event) {
     if (this.moreDataPresent) {
       let page: Pagination;
       page = _.cloneDeep(this.pagination);
       page.pageNumber = page.pageNumber + 1;
       this.onShowMoreEvt.emit({originalEvent: event, data: this.gridData, pagination: page});
     }
   }
   createPagination(i) {
        return (i + 1) < (this.pagination.maxRow * this.pagination.pageNumber) ;
   }
   showFilter() {
     this.filterable = !this.filterable;
      if (!this.filterable) {
        this.onRefresh();
      }
   }
   onGridFilter($event) {
     if ($event.filterBy.trim() !== '') {
        this.gridData = $event.data;
     } else {
        this.gridData = this.copyOfGridData;
     }
     this.onFilterEvt.emit({originalEvent: $event.originalEvent, data:  $event.data, filterBy:  $event.filterBy});
   }
   onSplit($event) {
     const splitData = $event.splittedData;
     this.gridData = $event.data;
     // this.gridData = splitData.concat(_.cloneDeep(this.gridData))));
     for ( let k = 0; k < splitData.length; k++) {
       this.gridData.unshift(_.cloneDeep(splitData[k]));
     }
   }
   trackByFn(rowIndex) {
    return rowIndex;
  }

  onImportXlEvt($event){
    console.log($event);
    for ( let j = 0; j < $event.data.length; j++) {
       this.gridData.unshift($event.data[j]);
    }
    // this.gridData = $event.data;
  }

  showHide(row,i) {
      if(!row.isCollapsed){
        row.isCollapsed = true;
      }
      setTimeout(()=>{    
        const recHeight = this.el.nativeElement.querySelectorAll(".row-expand-container")[i].offsetHeight;
        const elRecWrp = this.el.nativeElement.querySelectorAll(".row-exp-wrapper")[i];
        if(elRecWrp.clientHeight){
          elRecWrp.style.height = 0;  
          setTimeout(()=>{ 
          row.isCollapsed=false;
          },400);
        } else {
          elRecWrp.style.height = recHeight+"px";  
        }        
       // console.log(this.el.nativeElement.querySelectorAll(".row-expand-container"), this.el.nativeElement.querySelectorAll(".row-expand-container")[0].offsetHeight);
      },1);  
  }

 allowDrop(ev) {
  // console.log('allowDrop', ev);
    ev.preventDefault();
}
public swapObject(srcIndex: number, targetIndex: number){
  console.log(srcIndex, targetIndex);
  let temp = this.gridData[srcIndex];
  this.gridData[srcIndex] = this.gridData[targetIndex];
  this.gridData[targetIndex] = temp;
}
searchId(arr) {
  for(let i = 0; i< arr.length; i++) {
     if(arr[i].id && arr[i].id.indexOf('olam-tr-') > -1) {
       return arr[i];
     }
  }
}
 drag(ev) {
   this.srcIndex = this.searchId(ev.path).id.replace('olam-tr-','');
  console.log('drag', ev.path[0].id);
    ev.dataTransfer.setData("text", ev.target.id);
}

 drop(ev) {
  this.destIndex = this.searchId(ev.path).id.replace('olam-tr-','');
  this.swapObject(this.srcIndex, this.destIndex);
  ev.preventDefault();
    console.log('drop', ev.path[1].id, ev);
    //var data = ev.dataTransfer.getData("text");
   //  ev.target.appendChild(document.getElementById(data));
}
  onWindowLoadEvt($evt) {
    console.log($evt.width, $evt.height);
    const width = $evt.width;
    if(width <= 320) {
      this.columnConfig = this.columnConfig.slice(0,1);
      this.rowExpansion = true;
    } else if(width > 320 && width < 480 ) {
      this.columnConfig = this.columnConfig.slice(0,2);
      this.rowExpansion = true;
    } else if(width > 480 && width < 768 ) {
      this.columnConfig = this.columnConfig.slice(0,3);
      this.rowExpansion = true;
    } else if(width > 768 && width < 960 ) {
      this.columnConfig = this.columnConfig.slice(0,4);
      this.rowExpansion = true;
    } else {
      this.columnConfig = this.copyOfColumnConfig;
    }

    
    console.log(this.columnConfig);
  }

  onKeyDown($event) {
    console.log($event);
  }

  classCalculation() {

  }
}

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IntlModule,
      DateInputsModule,
      ModalModule.forRoot(),
      OlamMultiSelectModule,
      OlamSingleSelectModule
    ],
    exports: [
      DatagridComponent,
      GridcolumnComponent,
      HeaderTemplateDirective,
      FooterTemplateDirective,
      EditTemplateDirective,
      BodyTemplateDirective,
      RowExpansionTemplateDirective,
      EditTemplateLoader,
      HeaderTemplateLoader,
      BodyTemplateLoader,
      RowExpansionTemplateLoader,
      FilterComponent,
      XlexportComponent,
      SplitComponent,
      McolTemplateLoader,
      McolHeaderTemplateLoader,
      XlimportComponent,
      ActionColTemplateLoader,
      ActionColTemplateDirective,
      ToolbarActionTemplateDirective,
      ToolbarActionTemplateLoader,
      StickyDirective,
      ResponsiveDirective
      ],
    declarations: [
      DatagridComponent,
      GridcolumnComponent,
      HeaderTemplateDirective,
      FooterTemplateDirective,
      EditTemplateDirective,
      BodyTemplateDirective,
      RowExpansionTemplateDirective,
      EditTemplateLoader,
      HeaderTemplateLoader,
      BodyTemplateLoader,
      RowExpansionTemplateLoader,
      FilterComponent,
      XlexportComponent,
      SplitComponent,
      McolTemplateLoader,
      McolHeaderTemplateLoader,
      XlimportComponent,
      ActionColTemplateLoader,
      ActionColTemplateDirective,
      ToolbarActionTemplateDirective,
      ToolbarActionTemplateLoader,
      StickyDirective,
      ResponsiveDirective
    ],
     providers: [XlService, WindowRef]
})
export class OlamDataGridModule { }
