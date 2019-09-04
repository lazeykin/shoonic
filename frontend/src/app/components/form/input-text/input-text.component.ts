import {Component, Inject, Input, EventEmitter, Output, forwardRef, OnInit, SkipSelf, Host, Optional} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputTextComponent),
            multi: true
        }
    ]
})
export class InputTextComponent implements ControlValueAccessor, OnInit {
  inputText = '';
  @Input() formControlName: string;
  @Input() isPadding = false;
  @Input() class = 'form-control'
  @Input() label = 'My label';
  @Input() placeholder = 'My placeholder';
  @Input() styles: any = {};
  @Input() isModalOffer = false;
  @Input() phone = false;

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
                // console.log('Found control for ' + this.formControlName)
                // console.log(this.control)
            } else {
                console.warn('Missing FormControlName directive from host element of the component');
            }
        } else {
            console.warn('Can\'t find parent FormGroup directive');
        }
    }

    setDisabledState(isDisabled: boolean): void {
    }
    _keyPress(event: any) {
        if (this.phone) {
            const pattern =/^\d*[0-9]\d*$/;
            let inputChar = String.fromCharCode(event.charCode);
            if (!pattern.test(inputChar)) {
                // invalid character, prevent input
                event.preventDefault();
            }
        } else {
            return
        }

    }
}
