import { Component, OnInit, OnChanges, OnDestroy, Input, EmbeddedViewRef, ViewContainerRef } from "@angular/core";

@Component({
    selector: 'olam-edit-template-loader',
    template: ``
})
export class EditTemplateLoader implements OnInit, OnChanges, OnDestroy {
            
    @Input() column: any;
    
    @Input() rowData: any;
    
    @Input() rowIndex: any;
            
    view: EmbeddedViewRef<any>;
    
    constructor(public viewContainer: ViewContainerRef) {}
    
    ngOnInit() {
        if(this.column.editorTemplate){
            this.view = this.viewContainer.createEmbeddedView(this.column.editorTemplate, {
                '\$implicit': this.column,
                'rowData': this.rowData,
                'rowIndex': this.rowIndex
            });
       }
    }
    ngOnChanges() {
        if(this.view){
            this.view.context.rowIndex = this.rowIndex;
        }        
    }
    ngOnDestroy() {
		if(this.view) {
            this.view.destroy();
        }
	}
}