import { Component, OnInit, Input, TemplateRef, ContentChild, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { HeaderTemplateDirective } from '../../templates/header-template.directive';
import { EditTemplateDirective } from '../../templates/edit-template.directive';
import { FooterTemplateDirective } from '../../templates/footer-template.directive';
import { BodyTemplateDirective } from '../../templates/body-template.directive';
import { ActionColTemplateDirective } from '../../templates/action-col-temp.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'olam-gridcolumn',
  templateUrl: './gridcolumn.component.html',
  styleUrls: ['./gridcolumn.component.css']
})
export class GridcolumnComponent implements AfterContentInit  {
  // tslint:disable-next-line:no-input-rename
  @Input('field') field: string;
  // tslint:disable-next-line:no-input-rename
  @Input('title') title: string;
  @Input('editable') editable: boolean;
  @Input('width') width: string;
  @Input('cssClass') cssClass: string;
  @Input('mandatory') mandatory: boolean;
  @Input('colGrouping') colGrouping: number;
  @ContentChildren(HeaderTemplateDirective) hTemplates: QueryList<HeaderTemplateDirective>;
  @ContentChildren(FooterTemplateDirective) fTemplates: QueryList<FooterTemplateDirective>;
  @ContentChildren(EditTemplateDirective) eTemplates: QueryList<EditTemplateDirective>;
  @ContentChildren(BodyTemplateDirective) bTemplates: QueryList<BodyTemplateDirective>;
  @ContentChildren(ActionColTemplateDirective) actionColTemplates: QueryList<BodyTemplateDirective>;
  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @ContentChild(TemplateRef) toolBarTemplate: TemplateRef<any>;

  public headerTemplate: TemplateRef<any>;
  public bodyTemplate: TemplateRef<any>;
  public footerTemplate: TemplateRef<any>;
  public filterTemplate: TemplateRef<any>;
  public editorTemplate: TemplateRef<any>;
  public actionColTemplate: TemplateRef<any>;

  ngAfterContentInit(): void {
      this.hTemplates.forEach((item) => {
        this.headerTemplate = item.template;
      });
      this.fTemplates.forEach((item) => {
        this.footerTemplate = item.template;
      });
      this.eTemplates.forEach((item) => {
        this.editorTemplate = item.template;
      });
      this.bTemplates.forEach((item) => {
        this.bodyTemplate = item.template;
      });
      this.actionColTemplates.forEach((item) => {
        this.actionColTemplate = item.template;
      });
  }
}
