import { Component, OnInit, OnChanges, OnDestroy, EmbeddedViewRef, Input, ViewContainerRef, SimpleChanges } from "@angular/core";

@Component({
    selector: 'olam-body-template-loader',
    template: ``
})
export class BodyTemplateLoader implements OnInit, OnChanges, OnDestroy {
        
    @Input() column: any;

    @Input() rowData: any;
    
    @Input() rowIndex: any;
            
    view: EmbeddedViewRef<any>;
    
    constructor(public viewContainer: ViewContainerRef) {}
    
    ngOnInit() {
        // console.log(this.rowIndex);
        if(this.column.bodyTemplate){
            this.view = this.viewContainer.createEmbeddedView(this.column.bodyTemplate, {
                '\$implicit': this.column,
                'rowData': this.rowData,
                'rowIndex': this.rowIndex
            });
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if(this.view){
            // console.log('here', changes, changes.rowIndex.currentValue);
            if(changes.rowIndex.previousValue !== changes.rowIndex.currentValue){
                this.view.context.rowIndex = this.rowIndex;
            }            
        }        
    }
	
    ngOnDestroy() {
		if(this.view) {
            this.view.destroy();
        }
	}
}