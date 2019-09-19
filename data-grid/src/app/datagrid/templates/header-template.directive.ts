import { OnInit, TemplateRef, Directive } from '@angular/core';

@Directive({
  selector: '[headerTemplate]',
  host: {
  }
})
export class HeaderTemplateDirective implements OnInit {

  constructor(public template: TemplateRef<any>) { }

  ngOnInit() {
  }

}
