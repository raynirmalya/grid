import { Directive, Output, OnInit, TemplateRef, ElementRef, HostListener, Inject, Renderer2, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { WindowRef } from '../window.services';
import { element } from 'protractor';

export class WindowSize {
    width: number;
    height: number;
}
@Directive({
  selector: '[responsive]'
})
export class ResponsiveDirective implements OnInit {
  @Output('onWindowLoadEvt') onWindowLoadEvt: EventEmitter<WindowSize> = new EventEmitter();
  constructor(private el: ElementRef,
    private renderer: Renderer2,
    public windowRef: WindowRef) { }

  @HostListener("window:resize", [])
  onWindowResize($event) {
      this.onWindowLoadEvt.emit({width: this.windowRef.nativeWindow.innerWidth, height: this.windowRef.nativeWindow.innerHeight});
  }
  ngOnInit() {
    this.onWindowLoadEvt.emit({width: this.windowRef.nativeWindow.innerWidth, height: this.windowRef.nativeWindow.innerHeight});
  }

}
