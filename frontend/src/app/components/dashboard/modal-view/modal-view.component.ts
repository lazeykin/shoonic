import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {PaginationChangedEvent} from '../../../events';
import {ModalService} from '../../../_services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-modal-view',
  templateUrl: './modal-view.component.html',
  styleUrls: ['./modal-view.component.sass']
})
export class ModalViewComponent implements OnInit {
  @Input('group') form_contact: FormGroup
    @Output() cancelForm = new EventEmitter<string>()
    @Output() saveForm = new EventEmitter<string>()
    constructor(
        private router: Router
    ) { }

  ngOnInit() {
  }
    onCloseModal() {
      this.cancelForm.emit()
    }
    onContactAdd() {
        this.saveForm.emit()
    }
}
