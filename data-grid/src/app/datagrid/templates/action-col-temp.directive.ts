import { OnInit, TemplateRef, Directive } from '@angular/core';

@Directive({
  selector: '[actionColTemplate]',
  host: {
  }
})
export class ActionColTemplateDirective implements OnInit {

  constructor(public template: TemplateRef<any>) { }

  ngOnInit() {
  }

}
