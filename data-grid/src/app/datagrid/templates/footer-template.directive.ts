import { Directive, OnInit, TemplateRef } from '@angular/core';

@Directive({
  selector: '[footerTemplate]',
  host: {}
})
export class FooterTemplateDirective implements OnInit {

  constructor(public template: TemplateRef<any>) { }

  ngOnInit() {
  }

}
