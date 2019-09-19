import { Component, OnInit, OnDestroy, EmbeddedViewRef, Input, ViewContainerRef, TemplateRef } from "@angular/core";

@Component({
    selector: 'olam-toolbar-action-template-loader',
    template: ``
})
export class ToolbarActionTemplateLoader implements OnInit, OnDestroy {
        
    @Input() template: TemplateRef<any>;
    
    @Input() rowData: any;
    
    @Input() rowIndex: any;
    
    view: EmbeddedViewRef<any>;
    
    constructor(public viewContainer: ViewContainerRef) {}
    
    ngOnInit() {
        if(this.template){
            this.view = this.viewContainer.createEmbeddedView(this.template, {
                '\$implicit': this.template,
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