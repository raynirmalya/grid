// tslint:disable-next-line:max-line-length
import { Component, OnInit, NgModule, SimpleChanges, OnChanges, ViewEncapsulation, ContentChild, forwardRef, Input, Output, EventEmitter, ElementRef, AfterViewInit, Pipe, PipeTransform } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyException } from './multiselect.model';
import { DropdownSettings } from './multiselect.interface';
import { ClickOutsideDirective } from './clickOutside';
import { ListFilterPipe } from './list-filter';
import { Item, TemplateRenderer } from './menu-item';
import { SelectItem } from '../interface/selectItem';
export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AngularMultiSelect),
    multi: true
};
export const DROPDOWN_CONTROL_VALIDATION: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => AngularMultiSelect),
    multi: true,
}
const noop = () => {
};

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'olam-multiselect',
    templateUrl: './multiselect.component.html',
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[class]': 'defaultSettings.classes' },
    styleUrls: ['./multiselect.component.scss'],
    providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR, DROPDOWN_CONTROL_VALIDATION]
})

// tslint:disable-next-line:component-class-suffix
export class AngularMultiSelect implements OnInit, ControlValueAccessor, OnChanges, Validator {

    @Input()
    data: Array<SelectItem>;
    @Input('valueField') valueField: string;
    @Input('textField') textField: string;
    @Input()
    settings: DropdownSettings;

    @Output('onSelect')
    onSelect: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();

    @Output('onDeSelect')
    onDeSelect: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();

    @Output('onSelectAll')
    onSelectAll: EventEmitter<Array<SelectItem>> = new EventEmitter<Array<SelectItem>>();

    @Output('onDeSelectAll')
    onDeSelectAll: EventEmitter<Array<SelectItem>> = new EventEmitter<Array<SelectItem>>();

    @ContentChild(Item) itemTempl: Item;

    public selectedItems: Array<SelectItem>;
    public isActive: Boolean = false;
    public isSelectAll: Boolean = false;
    public groupedData: Array<SelectItem>;
    public v: string[];
    filter: SelectItem =  {label: '', value: ''};
    defaultSettings: DropdownSettings = {
        singleSelection: false,
        text: 'Select',
        enableCheckAll: false,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        maxHeight: 300,
        badgeShowLimit: 2,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available'
    }
    public parseError: boolean;
    constructor() {

    }
    ngOnInit() {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        if (this.settings.groupBy) {
            this.groupedData = this.transformData(this.data, this.settings.groupBy);
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.firstChange) {
            if (this.settings.groupBy) {
                this.groupedData = this.transformData(this.data, this.settings.groupBy);
                if (this.data.length === 0) {
                    this.selectedItems = [];
                }
            }
            this.writeValue(this.v);
        }
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngDoCheck() {
        if (this.selectedItems) {
            if (this.selectedItems.length === 0 || this.data.length === 0 || this.selectedItems.length < this.data.length) {
                this.isSelectAll = false;
            }
        }
    }
    onItemClick(item: SelectItem, index: number, evt: Event) {
        if (this.settings.disabled) {
            return false;
        }

        const found = this.isSelected(item);
        const limit = this.selectedItems.length < this.settings.limitSelection ? true : false;

        if (!found) {
            if (this.settings.limitSelection) {
                if (limit) {
                    this.addSelected(item);
                    this.onSelect.emit(item);
                }
            } else {
                this.addSelected(item);
                this.onSelect.emit(item);
            }

        } else {
            this.removeSelected(item);
            this.onDeSelect.emit(item);
        }
        if (this.isSelectAll || this.data.length > this.selectedItems.length) {
            this.isSelectAll = false;
        }
        if (this.data.length === this.selectedItems.length) {
            this.isSelectAll = true;
        }
    }
    public validate(c: FormControl): any {
        return null;
    }
    // tslint:disable-next-line:member-ordering
    private onTouchedCallback: (_: any) => void = noop;
    // tslint:disable-next-line:member-ordering
    private onChangeCallback: (_: any) => void = noop;

    getObjectFromArray(value) {
        const temp = [];
        // console.log('1111', this.data, this.v, value)
        for(let i=0;i<this.data.length;i++){
            if(value.indexOf(this.data[i].value) !== -1){ 
                temp.push(this.data[i]);
            }
        }
        console.log(temp);
        return temp;
    }
    writeValue(value: any) {
        if (value !== undefined && value !== null) {
            this.v = value;
            const tempValue = this.getObjectFromArray(value);
            if (this.settings.singleSelection) {
                try {

                    if (value.length > 1) {
                        this.selectedItems = [tempValue[0]];
                        throw new MyException(404, { 'msg': 'Single Selection Mode, Selected Items cannot have more than one item.' });
                    } else {
                        this.selectedItems = tempValue;
                    }
                } catch (e) {
                    console.error(e.body.msg);
                }

            } else {
                if (this.settings.limitSelection) {
                    this.selectedItems = tempValue.splice(0, this.settings.limitSelection);
                } else {
                    this.selectedItems = tempValue;
                }
                if (this.selectedItems.length === this.data.length && this.data.length > 0) {
                    this.isSelectAll = true;
                }
            }
        } else {
            this.selectedItems = [];
        }
    }

    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    trackByFn(index: number, item: any) {
        return item.value;
    }
    isSelected(clickedItem: any) {
        let found = false;
        // tslint:disable-next-line:no-unused-expression
        this.selectedItems && this.selectedItems.forEach(item => {
            if (clickedItem.value === item.value) {
                found = true;
            }
        });
        if (this.settings.singleSelection) {
           this.filter = {label: '', value: ''};
           this.isActive = false;
        }
        return found;
    }
    getValueArr(arr) {
        const temp =[];
        for(let i=0;i<arr.length;i++){
            temp.push(arr[i].value);
        }
        console.log(temp);
        return temp;
    }
    addSelected(item: any) {
        if (this.settings.singleSelection) {
            this.selectedItems = [];
            this.selectedItems.push(item);
        } else {
             this.selectedItems.push(item);
        }
        this.onChangeCallback(this.getValueArr(this.selectedItems));
        this.onTouchedCallback(this.getValueArr(this.selectedItems));
    }
    removeSelected(clickedItem: any) {
        // tslint:disable-next-line:no-unused-expression
        this.selectedItems && this.selectedItems.forEach(item => {
            if (clickedItem.value === item.value) {
                this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
            }
        });
        this.onChangeCallback(this.getValueArr(this.selectedItems));
        this.onTouchedCallback(this.getValueArr(this.selectedItems));
    }
    toggleDropdown(evt: any) {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        evt.preventDefault();
    }
    closeDropdown() {
        this.filter =  {label: '', value: ''};
        this.isActive = false;
    }
    toggleSelectAll() {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            this.selectedItems = this.data.slice();
            this.isSelectAll = true;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onSelectAll.emit(this.selectedItems);
        } else {
            this.selectedItems = [];
            this.isSelectAll = false;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onDeSelectAll.emit(this.selectedItems);
        }
    }
    transformData(arr: Array<SelectItem>, field: any): Array<SelectItem> {
        const groupedObj: any = arr.reduce((prev: any, cur: any) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        const tempArr: any = [];
        Object.keys(groupedObj).map(function (x) {
            tempArr.push({ key: x, value: groupedObj[x] });
        });
        return tempArr;
    }
}

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [AngularMultiSelect,ClickOutsideDirective, ListFilterPipe, Item, TemplateRenderer],
    exports: [AngularMultiSelect,  ListFilterPipe, Item, TemplateRenderer]
})
export class OlamMultiSelectModule { }
