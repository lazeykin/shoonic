import {Component, Inject, Input, EventEmitter, Output, forwardRef, Optional, Host, SkipSelf} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputPasswordComponent),
            multi: true
        }
    ]
})
export class InputPasswordComponent implements ControlValueAccessor {
    inputText = '';
    show = false;
    @Input() label = 'label name';
    @Input() placeholder = 'some text';
    @Input() formControlName: string;
    @Input() class = '';
    control: AbstractControl;

    constructor (
        @Optional() @Host() @SkipSelf()
        public controlContainer: ControlContainer
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
    showPassword() {
        this.show = !this.show;
    }

    ngOnInit(): void {
        if (this.controlContainer) {
            console.log(this.controlContainer)
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
