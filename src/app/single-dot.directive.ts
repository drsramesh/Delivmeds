import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSingleDot]'
})
export class SingleDotDirective {

  private regex: RegExp = new RegExp(/[0-9]/g);
  // Allow key codes for special events. Reflect :
  private specialKeys: Array<number> = [46, 8, 9, 27, 13, 110, 190, 35, 36, 37, 39];
  // Backspace, tab, end, home
  elemRef: ElementRef
  @Input() maxlength: number;
  @Input() min: number;
  @Input() max: number;
  @Input() DecimalPlaces: string;
  constructor(private el: ElementRef) { 

    this.elemRef = el
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    
 let e = <any> event;
if ((
(this.specialKeys.indexOf(event.which) > -1) ||
// to allow backspace, enter, escape, arrows  
(e.which == 65 && e.ctrlKey == true) ||
// Allow: Ctrl+C        
(e.which == 67 && e.ctrlKey == true) ||
// Allow: Ctrl+X
(e.which == 88 && e.ctrlKey == true))) {
return;
} else if (// to allow numbers  
(e.which >= 48 && e.which <= 57) ||
// to allow numpad number  
(event.which >= 96 && event.which <= 105)) { }
else {
    event.preventDefault();
  }
  let current: string = this.el.nativeElement.value;
  let next: string = current.concat(event.key);
  if ((next && !String(next).match(this.regex)) ||
    (this.maxlength && next.length > this.maxlength) ||
    (this.min && +next < this.min) ||
    (this.max && +next >= this.max)) {
    event.preventDefault();
  }  
  }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    
    let e = <any> event
    if (this.DecimalPlaces) {
      
      let currentCursorPos: number;  
     
      if (typeof this.elemRef.nativeElement.selectionStart == "number") {
          currentCursorPos = this.elemRef.nativeElement.selectionStart ;
        
          
      } else {
        // Probably an old IE browser 
        console.log("This browser doesn't support selectionStart");
      }
      let dotLength: number = e.target.value.replace(/[^\.]/g, '').length  
      // If user has not entered a dot(.) e.target.value.split(".")[1] will be undefined
      let decimalLength = e.target.value.split(".")[1] ? e.target.value.split(".")[1].length : 0;
      // (this.DecimalPlaces - 1) because we don't get decimalLength including currently pressed character 
      // currentCursorPos > e.target.value.indexOf(".") because we must allow user's to enter value before dot(.)
      // Checking Backspace etc.. keys because firefox doesn't pressing them while chrome does by default
      if( dotLength > 1 || (dotLength === 1 && e.key === ".") || (decimalLength > (parseInt(this.DecimalPlaces) - 1) && 
        currentCursorPos > e.target.value.indexOf(".")) && ["Backspace", "ArrowLeft", "ArrowRight"].indexOf(e.key) === -1 ) {
          
        e.preventDefault();
      }
    }
}
}
