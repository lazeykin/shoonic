import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl} from '@angular/forms';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.css']
})
export class AddPhotoComponent implements OnInit {
  @Input('control') control: FormArray;
  photo: any = [];
  imgArr = [];
  arr = [];
  action: boolean = false;
  @Input() edit: boolean;
  constructor() { }

  ngOnInit() {
    console.log('control from add photo');
    console.log(this.control);
    for (let i = 0; i < 10; i++) {
      this.imgArr.push(i);
    }
    if (this.edit) {
      this.action = true;
    }
    this.control.valueChanges.subscribe(value => {
      console.log(value)
      if (this.action) {
        for (let i = 0; i < this.control.value.length; i++) {
          this.photo[i] = this.control.value[i].url;
          console.log(this.photo[i]);
        }
      }
    })
      if (this.control.value.length) {
        for (let i = 0; i < this.control.value.length; i++){
            this.photo[i] = this.control.value[i].url;
            console.log(this.photo[i])
        }

      } else {
        this.photo = [];
      }
  }
  pushToArray(value) {
    console.log(value);
    if (this.edit) {
      this.action = false;
    }
    this.control.push(new FormControl(value))
  }
  deleteArrayItem(i) {
      this.control.value.splice(i, 1);
      this.control.controls.splice(i,1);
      // this.control.removeAt(i);
  }

}
