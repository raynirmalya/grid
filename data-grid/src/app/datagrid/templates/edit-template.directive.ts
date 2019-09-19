import { Directive, OnInit, TemplateRef } from '@angular/core';

@Directive({
  selector: '[editTemplate]',
  host: {}
})
export class EditTemplateDirective implements OnInit {

  constructor(public template: TemplateRef<any>) { }

  ngOnInit() {
  }

}
