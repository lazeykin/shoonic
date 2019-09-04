import {Component, forwardRef, Host, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SellerAccountCompanyComponent} from '../../../dashboard';

@Component({
    selector: 'app-one-image-upload',
    templateUrl: './one-image-upload.component.html',
    styleUrls: ['./one-image-upload.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => OneImageUploadComponent),
            multi: true
        }
    ]
})

export class OneImageUploadComponent implements ControlValueAccessor, OnInit {
    @Input() formControlName: string;
    @Input() isShop = false;
    control: AbstractControl;
    public url: any;
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
        if (this.controlContainer) {
            if (this.formControlName) {
                this.control = this.controlContainer.control.get(this.formControlName);
                console.log(this.control)
            } else {
                console.warn('Missing FormControlName directive from host element of the component');
            }
        } else {
            console.warn('Can\'t find parent FormGroup directive');
        }
        const self = this;
        this.control.valueChanges.subscribe(function (x) {
            if(self.control.value !== null && self.control.value !== undefined) {
                if (!self.control.value.thumbnail_200) {
                    self.url = self.control.value.url;
                } else {
                    self.url = self.control.value.thumbnail_200;
                }
            }
        });
    }

    setDisabledState(isDisabled: boolean): void {
    }

    readUrl(event) {
        if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(event.target.files[0].name)) {
            this.control.setErrors({invalidImage: true})
        } 
        else if (event.target.files[0].size > 2097152) {
            this.control.setErrors({heavyImage: true})
        }
        else {
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();

                reader.onload = (event: ProgressEvent) => {
                    this.url = (<FileReader>event.target).result;
                };

                reader.readAsDataURL(event.target.files[0]);
            }
            this.fileToUpload = event.target.files[0];
            this.propagateChange(this.fileToUpload);
        }
    }
}

