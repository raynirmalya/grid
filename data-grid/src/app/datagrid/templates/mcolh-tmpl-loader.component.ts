import { Component, OnInit, OnDestroy, EmbeddedViewRef, Input, ViewContainerRef } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'olam-mcolh-template-loader',
    template: ``
})
// tslint:disable-next-line:component-class-suffix
export class McolHeaderTemplateLoader implements OnInit, OnDestroy {

    @Input() column: any;

    @Input() rowData: any;

    @Input() rowIndex: any;

    view: EmbeddedViewRef<any>;

    constructor(public viewContainer: ViewContainerRef) {}

    ngOnInit() {
        if (this.column.headerTemplate) {
            this.view = this.viewContainer.createEmbeddedView(this.column.headerTemplate, {
                '\$implicit': this.column,
                'rowData': this.rowData,
                'rowIndex': this.rowIndex
            });
        }
    }

    ngOnDestroy() {
     //   this.view.destroy();
    }
}
