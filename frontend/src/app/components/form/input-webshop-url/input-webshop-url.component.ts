import {Component, Inject, Input, EventEmitter, Output, forwardRef, OnInit, SkipSelf, Host, Optional} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input-webshop-url',
  templateUrl: './input-webshop-url.component.html',
  styleUrls: ['./input-webshop-url.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputWebshopUrlComponent),
      multi: true
    }
  ]
})
export class InputWebshopUrlComponent implements ControlValueAccessor, OnInit {

  inputText = '';
  @Input() formControlName: string;
  @Input() isPadding = false;
  @Input() class = 'form-control'
  @Input() label = 'My label';
  @Input() placeholder = 'My placeholder';
  @Input() styles: any = {};
  @Input() isModalOffer = false;
  activeInput = false;

  control: AbstractControl;


  constructor (
      @Optional() @Host() @SkipSelf()
      private controlContainer: ControlContainer
  ) {
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.inputText = value;
    }
  }

  onInputChange(){
    this.propagateChange(this.inputText)
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  ngOnInit(): void {
    if (this.controlContainer) {
      if (this.formControlName) {
        this.control = this.controlContainer.control.get(this.formControlName);
      } else {
        console.warn('Missing FormControlName directive from host element of the component');
      }
    } else {
      console.warn('Can\'t find parent FormGroup directive');
    }
  }

  setDisabledState(isDisabled: boolean): void {
  }
}
