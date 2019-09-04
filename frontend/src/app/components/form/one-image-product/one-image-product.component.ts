import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProductsService, UserService} from '../../../_services';
import {FormArray} from '@angular/forms';

@Component({
  selector: 'app-one-image-product',
  templateUrl: './one-image-product.component.html',
  styleUrls: ['./one-image-product.component.css']
})
export class OneImageProductComponent implements OnInit {
    public url: any;
    fileToUpload: File = null;
    // set photo
    @Input() set photo(value: string) {
        console.log(value)
        this.url = value;
    }
    @Input() control;
    image: any;
    @Output() passChange = new EventEmitter<any>();
    @Output() itemDelete = new EventEmitter<any>();

    constructor(
        private productsService: ProductsService,
        private userService: UserService,
    ) {
    }

    onDeleteItem(e) {
        this.url = '';
        this.itemDelete.emit();

    }

    ngOnInit(): void {
        // this.url = this.photo;
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
            this.productsService.uploadImage(this.fileToUpload, this.userService.getCurrentUserToken()).subscribe(
                data => {
                    this.image = data;
                    this.passChange.emit(this.image);

                },
                error => {
                    console.log(error);
                });
        }
    }

}
