import {Component, Inject, Input, EventEmitter, Output, forwardRef, OnInit, SkipSelf, Host, Optional} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputTextareaComponent),
            multi: true
        }
    ]
})
export class InputTextareaComponent implements ControlValueAccessor, OnInit {
    inputText = '';
    @Input() formControlName: string;
    @Input() isModalOffer = false;
    @Input() styles = "";
    @Input() label = 'My label';
    @Input() placeholder = 'My placeholder';

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

}
