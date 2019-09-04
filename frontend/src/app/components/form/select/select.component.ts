import {
    Component,
    OnInit,
    Input,
    forwardRef,
    Optional,
    Host,
    SkipSelf,
    EventEmitter,
    Output,
    SimpleChanges,
    SimpleChange, OnChanges
} from '@angular/core';
import {
    AbstractControl,
    ControlContainer,
    ControlValueAccessor,
    FormArray,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ]
})
export class SelectComponent implements ControlValueAccessor, OnInit, OnChanges {
    inputText: any = {};
    @Input() label = '';
    @Input() listArray: any = []; // todo: rename to options
    @Input() disabled = false;
    @Input() formControlName: string;
    @Input() formControl: any;
    @Input() info: '';
    @Input('group')
    public form_group: FormGroup;
    @Output() private valueChange = new EventEmitter();
    control: AbstractControl;

    constructor(@Optional() @Host() @SkipSelf()
                private controlContainer: ControlContainer,
                private router: Router,
                private route: ActivatedRoute) {
    }

    static createFormGroup(initial_value?: any): FormControl {

        return new FormControl({});

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.listArray !== 'undefined' && (this.listArray).length !== 0) {
            const listArray: SimpleChange = changes.product;
            if (this.formControl) {
                this.control = this.formControl;
                let x = this.formControl.value;
                console.log(x)
                console.log(this.listArray)
                    if (x !== undefined && x !== '' && x !== null) {
                        let find = this.listArray.find(z => z.name == x);
                        this.control.patchValue(find);
                        console.log('find');
                        console.log(find);
                    }
            }
        }
    }
    ngOnInit(): void {
        console.log('Form group from select');
        console.log(this.form_group);
        if (this.controlContainer) {
            if (this.formControlName) {
                this.control = this.controlContainer.control.get(this.formControlName);
                console.log('Found control for ' + this.formControlName);
                console.log(this.control);
                this.control.valueChanges.subscribe(x => {
                    console.log('app-select-component name:' + this.formControlName);
                    console.log(x);
                    if (typeof (this.control.value) !== 'object') {
                        if (x !== undefined && x !== '' && x !== null) {
                            let find = this.listArray.find(z => z.id === x);
                            this.control.setValue(find);
                            console.log('find');
                            console.log(find);
                        }
                    }
                });
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

    writeValue(value: any) {
        console.log(`app-select-component got new value '${value}'`);
        this.inputText = value;
    }

    propagateChange = (_: any) => {
    };

    registerOnChange(fn) {
        // todo: find why (change)="myHandler($event)" is gets "str value of input", not the actual value
        // https://blog.angularindepth.com/never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms-93b9eee9ee83
        console.log('registerOnChange');
        console.log(fn);
        this.propagateChange = fn;
    }

    registerOnTouched() {
    }

    compareTech(t1, t2): boolean {
        return t1 && t2 ? t1.id === t2.id : t1 === t2;
    }

    selectMethod() {
        if (this.form_group) {
            console.log(this.inputText);
            this.control.setValue(this.inputText);
        }
        this.propagateChange(this.inputText);
        console.log(this.inputText);
        this.valueChange.emit(this.inputText);
    }
}
