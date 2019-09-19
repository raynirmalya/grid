import { Component, OnInit, OnChanges, OnDestroy, EmbeddedViewRef, Input, ViewContainerRef } from "@angular/core";

@Component({
    selector: 'olam-action-template-loader',
    template: ``
})
export class ActionColTemplateLoader implements OnInit, OnChanges, OnDestroy {
        
    @Input() column: any;

    @Input() rowData: any;
    
    @Input() rowIndex: any;
            
    view: EmbeddedViewRef<any>;
    
    constructor(public viewContainer: ViewContainerRef) {}
    
    ngOnInit() {
        // console.log(this.rowIndex);
        if(this.column.actionColTemplate){
            this.view = this.viewContainer.createEmbeddedView(this.column.actionColTemplate, {
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