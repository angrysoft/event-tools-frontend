import { Directive, HostListener, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appEscKey]'
})
export class EscKeyDirective {
  router = inject(Router);
  backTo = input.required<string>()
  constructor() { }

  @HostListener("document:keydown.Escape", ["$event"])
    handleCancel() {
      this.router.navigateByUrl(this.backTo() , { replaceUrl: true });
    }
}
