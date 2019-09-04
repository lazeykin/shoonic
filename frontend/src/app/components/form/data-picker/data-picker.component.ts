import {Component, forwardRef, Host, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractControl, ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'app-data-picker',
    templateUrl: './data-picker.component.html',
    styleUrls: ['./data-picker.component.sass'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DataPickerComponent),
            multi: true
        }
    ]
})
export class DataPickerComponent implements OnInit {
    @Input() formControlName: string;
    @Input() label = 'My label';
    date: Date = new Date();
    settings = {
        bigBanner: true,
        format: 'dd-MMM-yyyy hh:mm a',
        defaultOpen: false,
        timePicker: true
    };
    control: AbstractControl;


    constructor(
        @Optional() @Host() @SkipSelf()
        private controlContainer: ControlContainer
    ) {
    }

    writeValue(value: any) {
        if (value !== undefined) {
            this.date = value;
        }
    }

    onInputChange(date) {
        let myDate = new Date(date);
        this.propagateChange(myDate);
    }

    propagateChange = (_: any) => {
    };

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
    }

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
