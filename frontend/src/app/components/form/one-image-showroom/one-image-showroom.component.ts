import {Component, forwardRef, Host, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SellerAccountCompanyComponent} from '../../../dashboard';

@Component({
    selector: 'app-one-image-showroom',
    templateUrl: './one-image-showroom.component.html',
    styleUrls: ['./one-image-showroom.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => OneImageShowroomComponent),
            multi: true
        }
    ]
})

export class OneImageShowroomComponent implements ControlValueAccessor, OnInit {
    @Input() formControlName: string;
    control: AbstractControl;
    isLoading: boolean = true;
    public url: any;
    @Input() isNewCreated: boolean;
    fileToUpload: File = null;

    constructor(
        @Optional() @Host() @SkipSelf()
        private controlContainer: ControlContainer,
        private sellerAccountCompanyComponent: SellerAccountCompanyComponent
    ) {
    }

    writeValue(value: any) {
        if (value !== undefined) {
            this.fileToUpload = value;
        }
    }


    propagateChange = (_: any) => {
    };

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
    }

    ngOnInit(): void {
        console.log(this.isNewCreated)
        if (this.controlContainer) {
            if (this.formControlName) {
                this.control = this.controlContainer.control.get(this.formControlName);
                if(this.control.value) {
                    console.log('values exists')
                    this.url = this.control.value.url;
                    this.isLoading = false;
                }
                console.log(this.control)
            } else {
                console.warn('Missing FormControlName directive from host element of the component');
            }
        } else {
            console.warn('Can\'t find parent FormGroup directive');
        }

        if(this.isNewCreated || !this.url){
            this.isLoading = false;
        }
        const self = this;
        this.control.valueChanges.subscribe(function (x) {
            if(self.control.value !== null && self.control.value !== undefined) {
                self.url = self.control.value.url;
                console.log('inside');
            }
            self.isLoading = false;
        });
        
    }

    setDisabledState(isDisabled: boolean): void {
    }

    readUrl(event) {
        if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(event.target.files[0].name)) {
            this.control.setErrors({invalidImage: true})
        } else {
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();

                reader.onload = (event: ProgressEvent) => {
                    this.url = (<FileReader>event.target).result;
                };

                reader.readAsDataURL(event.target.files[0]);
            }
            this.fileToUpload = event.target.files[0];
            console.log(this.fileToUpload);
            this.propagateChange(this.fileToUpload);
        }
    }
}

