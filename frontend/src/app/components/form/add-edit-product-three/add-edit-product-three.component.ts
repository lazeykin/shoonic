import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-edit-product-three',
  templateUrl: './add-edit-product-three.component.html',
  styleUrls: ['./add-edit-product-three.component.css']
})
export class AddEditProductThreeComponent implements OnInit {
  @Input('group') form_group: FormGroup;
  @Input() packingType: any;
  constructor() { }

  ngOnInit() {
  }

}
