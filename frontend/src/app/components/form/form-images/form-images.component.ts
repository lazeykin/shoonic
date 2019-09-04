import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormArray, ControlValueAccessor, Validators} from '@angular/forms';
import {AlertService, ProductsService, UserService} from '../../../_services/index';


@Component({
  selector: 'app-form-images',
  templateUrl: './form-images.component.html',
  styleUrls: ['./form-images.component.css']
})
export class FormImagesComponent implements OnInit {
    @Input('group')
    public form_group: FormGroup;
    model: any;
    fileToUpload: any;
    imagesUpload: string;
    noImage: boolean;
    data: any = {};
    control: any;
    dataArray: any = [];
    constructor(
        private productsService: ProductsService,
        private userService: UserService,
    ) { }

    static createFormArray() {
        return new FormArray([], [<any>Validators.required]);
    }
    onUploadFinished(event) {
        this.fileToUpload = event.file;
        if (this.fileToUpload) {
            this.productsService.uploadImage(this.fileToUpload, this.userService.getCurrentUserToken()).subscribe(
                data => {
                    this.data = data;
                    this.data['name'] = this.fileToUpload.name;
                    this.form_group.value.push(
                        this.data
                    );
                     this.form_group.setErrors(null);
                },
                error => {
                    console.log(error);
                });
        }

    }

    onRemoved(event) {
        this.form_group.value.splice(this.form_group.value.findIndex
        (item => item = event.file), 1);
        if (this.form_group.value.length < 1) {
            this.form_group.parent.controls['default_image'].patchValue(null);
            this.form_group.setErrors({required: true});
        }
    }

    ngOnInit() {
        console.log(this.form_group);
        this.control = this.form_group;
        this.form_group.valueChanges.subscribe(x => {
            console.log('Form form-images changed')
            console.log(x)
            this.model = Object.assign({}, x);
        });
    }
}
