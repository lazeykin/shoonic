import {Component, Inject, Input, EventEmitter, Output, forwardRef, OnInit, SkipSelf, Host, Optional} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputNumberComponent),
            multi: true
        }
    ]
})
export class InputNumberComponent implements ControlValueAccessor, OnInit {
    inputText = '';
    @Input() formControlName: string;
    @Input() min = 0;
    @Input() max = Infinity;
    @Input() step = 1;
    @Input() label = 'My label';
    @Input() placeholder = 'My placeholder';
    @Input() class = '';
    @Input('group')
    public form_group: FormGroup;

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

    onInputChange(){
        this.propagateChange(this.inputText)
    }

    propagateChange = (_: any) => {};

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    ngOnInit(): void {
        console.log(this.form_group);
        if (this.controlContainer) {
            if (this.formControlName) {
                this.control = this.controlContainer.control.get(this.formControlName);
                // console.log('Found control for ' + this.formControlName)
                console.log(this.control)
            } else {
                console.warn('Missing FormControlName directive from host element of the component');
            }
        } else {
            console.warn('Can\'t find parent FormGroup directive');
        }
        if (this.form_group) {
            this.control = this.form_group;
        }
    }

    setDisabledState(isDisabled: boolean): void {
    }
    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    static createFormGroup(param) {
        return new FormGroup( {
                'sizes': new FormControl(''),
                'availible_quantity' : new FormControl('')
            }
        );
    }
}
