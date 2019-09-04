import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
    @Input('group')
    public form_group: FormGroup;
    @Output() eventMes = new EventEmitter<string>();
    _isLoading : boolean;
    @Input() set isLoading(isLoading: boolean) {
        // console.log('prev value: ', this._isLoading);
        // console.log('got value: ', isLoading);
        this._isLoading = isLoading
        }
    constructor() { }

  ngOnInit() {
  }
    editPassword(e) {
        this._isLoading = true;
        this.eventMes.emit(e);
    }

}
