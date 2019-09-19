import { Component, OnInit, OnDestroy, EmbeddedViewRef, Input, ViewContainerRef } from "@angular/core";

@Component({
    selector: 'olam-header-template-loader',
    template: ``
})
export class HeaderTemplateLoader implements OnInit, OnDestroy {
        
    @Input() column: any;

    @Input() rowData: any;
    
    @Input() rowIndex: any;
            
    view: EmbeddedViewRef<any>;
    
    constructor(public viewContainer: ViewContainerRef) {}
    
    ngOnInit() {
        if(this.column.headerTemplate){
            this.view = this.viewContainer.createEmbeddedView(this.column.headerTemplate, {
                '\$implicit': this.column,
                'rowData': this.rowData,
                'rowIndex': this.rowIndex
            });
        }
    }
	
    ngOnDestroy() {
		if(this.view) {
            this.view.destroy();
        }
	}
}