import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.sass']
})
export class SelectFilterComponent implements OnInit {
  @Input() label = 'My label';
  @Input() sortBy = false;
  @Input() stock = false;
  _options: any = [];
  @Input() set options(value: string) {
   this._options = value;
   if (this.sortBy) {
     this.sortBySelect = this._options[2];
   }
  }
  @Input() class = "";
  @Output() filter = new EventEmitter<string>();
  sortBySelect: any;
  urlFilter: string;
  constructor() { }

  ngOnInit() {
    if (this.stock) {
      this.sortBySelect = this._options[2];
    }
  }
  selectSortBy() {
    this.urlFilter = this.sortBySelect;
    this.passToParent();
  }
  passToParent() {
    this.filter.emit(this.urlFilter);
  }
}
