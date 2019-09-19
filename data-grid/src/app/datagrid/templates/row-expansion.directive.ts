import { OnInit, TemplateRef, Directive } from '@angular/core';

@Directive({
  selector: '[rowExpansionTemplate]',
  host: {
  }
})
export class RowExpansionTemplateDirective implements OnInit {

  constructor(public template: TemplateRef<any>) { }

  ngOnInit() {
  }

}
