export class GridConfig {
    public gridId: number;
    public gridColumns: ColumnConfig;
    public sortable: boolean;
    public filterable: boolean;
    public pageable: boolean;
    public lazyLoading: boolean;
    public showMore: boolean;
    public maxRow: number;
    public expandable: string;
    public editable: boolean;
    public mode: string;
    public data: any [];
    public checkboxColumn: boolean;
    public toolBarActionButtons: ActionButtons;
    public expandRowActions: RowActions;
    public inlineRowActions: RowActions;
}

export class ColumnConfig {
    public field?: string;
    public title?: string;
    public dataType?: string;
    public htmlElType?: string;
}

export class ToolbarButtons {
    public copy?: boolean; 
    public add?: boolean; 
    public save?: boolean; 
    public addMultiple?: boolean; 
    public refresh?: boolean; 
    public delete?: boolean;
    public filterable?: boolean;
    public splitable?: boolean;
    public excelExport?: boolean;
    public csvExport?: boolean;
    public selectedExport?: boolean;
    public template?: boolean;
    public excelImport?: boolean;
    public colExpand?: boolean;
}

export class CallbackData {
    public originalEvent: any;
    public data: any[];
    public pagination: Pagination;
}

export class OnFilterCallbackData {
    public originalEvent: any;
    public data: any[];
    public filterBy:  any;
}

export class OnSortCallbackData {
    public originalEvent: any;
    public field: string;
    public status:  string;
}
export class OnRowSelectCallbackData {
    public originalEvent: any;
    public data: any[];
    public pagination: Pagination;
    public selectedIndex: number[];
    public selectedRows: any[];
    public currentSelection: any;
}

/*
export class ColumnConfig {
    public columnLabel: string;
    public fieldName: string;
    public colspan: number;
    public htmlElement: string;
    public htmlElData: any [];
    public htmlElKey: string;
    public htmlElValue: string;
}*/

export class ActionButtons {
    public exportToExcel: boolean;
    public refresh: boolean;
    public copy: boolean;
    public save: boolean;
    public delete: boolean;
}

export class RowActions {
    public save: boolean;
    public update: boolean;
    public reactivate: boolean;
    public deactivate: boolean;
    public delete: boolean;
    public reset: boolean;
    public cancel: boolean;
}

export class Pagination {
    constructor(public maxRow: number, public pageNumber: number) {

    }
}
