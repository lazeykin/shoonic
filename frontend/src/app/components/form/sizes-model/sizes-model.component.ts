import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-sizes-model',
  templateUrl: './sizes-model.component.html',
  styleUrls: ['./sizes-model.component.css']
})
export class SizesModelComponent implements OnInit {

    @Input('group')
    public form_group: FormGroup;

    constructor() { }

    static createFormGroup(initial_value?: any): FormGroup {
        if (initial_value === null || initial_value === undefined) {
            return new FormGroup({
                sizes: new FormControl(''),
                availible_quantity: new FormControl(''),
            });
        } else {
            return new FormGroup({
                sizes: new FormControl(initial_value['sizes']),
                availible_quantity: new FormControl(initial_value['availible_quantity']),
            });
        }
    }


    ngOnInit() {
        console.log(this.form_group);
        this.form_group.valueChanges.subscribe(x => {
            console.log('Form one-email-pass changed')
            console.log(x)
        });
    }

}
