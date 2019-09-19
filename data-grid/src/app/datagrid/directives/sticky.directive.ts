import { Directive, OnInit, TemplateRef, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { WindowRef } from '../window.services';
import { element } from 'protractor';
import { DOCUMENT } from "@angular/platform-browser";
@Directive({
  selector: '[sticky]',
  host: {}
})
export class StickyDirective implements OnInit {
  public fixedHeader = false;
  constructor(private el: ElementRef, @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public windowRef: WindowRef) { }

  @HostListener("window:scroll", [])
  onWindowScroll($event) {
      let woffset: number = this.windowRef.nativeWindow.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      let offset: number = this.el.nativeElement.parentElement.offsetTop - this.el.nativeElement.offsetTop;
      let tableHeight: number = this.el.nativeElement.parentElement.offsetHeight;
      let headerHeight: number = this.el.nativeElement.offsetHeight;
      // console.log('111', woffset, offset, (offset+tableHeight));
      if(woffset > offset) {
        this.renderer.addClass(this.el.nativeElement, 'fixed-header');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'fixed-header');
      }

      if( (woffset+headerHeight) > (offset+tableHeight)) {
        this.renderer.removeClass(this.el.nativeElement, 'fixed-header');
      }
      // console.log(offset,woffset,this.el.nativeElement.offsetHeight,this.el.nativeElement.offsetWidth);
      
  }
  ngOnInit() {
  }

}
