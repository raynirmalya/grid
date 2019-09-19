import { OnInit, TemplateRef, Directive, Input } from '@angular/core';

@Directive({
  selector: '[toolbarActionTemplate]',
  host: {
  }
})
export class ToolbarActionTemplateDirective implements OnInit {
  @Input('before') before: string;
  constructor(public template: TemplateRef<any>) { }

  ngOnInit() {
  }

}
