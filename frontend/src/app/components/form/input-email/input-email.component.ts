import {Component, Inject, Input, EventEmitter, Output, forwardRef, Optional, Host, SkipSelf} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input-email',
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputEmailComponent),
            multi: true
        }
    ]
})
export class InputEmailComponent implements ControlValueAccessor {
    inputText = '';
    @Input() label = '';
    @Input() placeholder = 'some text';
    @Input() class = 'form-control'
    @Input() formControlName: string;
    @Input() styles: any = {};
    @Input() isModalOffer = false;
    @Input() isHomePage: boolean = false;
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
    propagateChange = (_: any) => {};

    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched() {}
    onInputChange() {
        this.propagateChange(this.inputText);
    }

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
