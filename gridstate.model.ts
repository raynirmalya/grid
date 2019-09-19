import { GroupDescriptor } from "@progress/kendo-data-query/dist/npm/grouping/group-descriptor.interface";
import { CompositeFilterDescriptor } from "@progress/kendo-data-query";

export class StateModel {
    public filter: FilterModel;
    public group: GroupDescriptor[];
}

export class FilterModel {
    public filters: OperatorModel[];
    public logic: string;
}

export class OperatorModel {
    public field: string;
    public operator: string;
    public value: string[];
}