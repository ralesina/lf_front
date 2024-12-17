import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appImageFallback]'
})
export class ImageFallbackDirective {
  @Input() fallbackSrc = 'assets/images/placeholder.png';

  @HostListener('error')
  onError() {
    const img = this.el.nativeElement;
    img.src = this.fallbackSrc;
  }

  constructor(private el: ElementRef) {}
}