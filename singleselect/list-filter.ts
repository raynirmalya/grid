import { Pipe, PipeTransform } from '@angular/core';

import { SelectItem } from  '../interface/selectItem';

@Pipe({
    name: 'listFilter',
    pure: false
})
export class ListFilterPipe implements PipeTransform {
    transform(items: SelectItem[], filter: SelectItem): any[] {
       // console.log(valueField, textField);
        if (!items || !filter) {
            return items;
        }
        return items.filter((item: SelectItem) => this.applyFilter(item, filter));
    }
    applyFilter(item: SelectItem, filter: SelectItem): boolean {
        return !(filter.label && item.label && item.label.toLowerCase().indexOf(filter.label.toLowerCase()) === -1);
    }
}
