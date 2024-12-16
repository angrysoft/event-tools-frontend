import { Directive, ElementRef, OnInit } from "@angular/core";

@Directive({
  selector: "[appAutofocus]",
  standalone: true,
})
export class AutofocusDirective implements OnInit {
  constructor(private readonly host: ElementRef) {}

  ngOnInit(): void {
    this.host.nativeElement.focus();
  }
}
