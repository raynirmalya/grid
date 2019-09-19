import { OnInit, TemplateRef, Directive } from '@angular/core';

@Directive({
  selector: '[bodyTemplate]',
  host: {
  }
})
export class BodyTemplateDirective implements OnInit {

  constructor(public template: TemplateRef<any>) { }

  ngOnInit() {
  }

}
