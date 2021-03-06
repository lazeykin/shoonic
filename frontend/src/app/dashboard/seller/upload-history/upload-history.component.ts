// import { PaginationChangedEvent } from './../../../events/index';
// import { PaginationComponent } from './../../messenger/components/pagination/pagination.component';
// import { Observable, interval } from 'rxjs';
// import { isString } from 'util';
// import { UserService } from './../../../_services/user.service';
// import { ProductsService } from './../../../_services/products.service';
// import { Component, OnInit, ViewChild } from '@angular/core';

// @Component({
//     selector: 'app-upload-history',
//     templateUrl: './upload-history.component.html',
//     styleUrls: ['./upload-history.component.sass']
// })
// export class UploadHistoryComponent implements OnInit {
//     @ViewChild(PaginationComponent) pagination;
//     constructor(
//         private productsService: ProductsService,
//         private userService: UserService
//     ) { }

//     items: any = [];
//     selectedJobs: any = [];
//     selectedJobsLength: number = 0;
//     limit: number = 6;
//     offset: number = 0;
//     noFiles: boolean = false;

//     displayPublish: boolean;
//     displayDraft: boolean;
//     displayCancel: boolean;
//     displayDelete: boolean;
//     showErrorReport: any = [];
//     id: any; 

//     ngOnInit(): void { 
//         this.loadPage();
//         this.id  = setInterval(() => {
//             this.loadPage(); 
//           }, 3000);

//     }

//     ngOnDestroy(): void {
//         if (this.id) {
//             clearInterval(this.id);
//         } 
//     }
//     getUploadHistory(query = '') : any {
//         if(!query) {
//             query = '?limit='+this.limit+'&offset='+this.offset;
//         }
//         this.productsService.getUploadHistory(query, this.userService.getCurrentUserToken())
//             .subscribe(
//                 data => {
//                     this.items = data['results'];
//                     if(!this.items.length) {
//                         this.noFiles = true;
//                     }
//                     else {
//                         this.noFiles = false;
//                     }
//                 },
//                 error => {
//                     console.log(error)
//                 }
//             )
//     }

//     deleteJob(id) {
//         this.selectedJobs = [];
//         this.selectedJobsLength = 0;
//         this.productsService.deleteJobFromHistory(id, this.userService.getCurrentUserToken())
//             .subscribe(
//                 data => {
//                     this.getUploadHistory()
//                 }
//             )
//     }

//     cancelJob(id) {
//         this.selectedJobs = [];
//         this.selectedJobsLength = 0;
//         this.productsService.cancelJob(id, this.userService.getCurrentUserToken())
//             .subscribe(
//                 data => {
//                     this.getUploadHistory()
//                 }
//             )
//     }

//     publish(id) {
//         this.selectedJobs = [];
//         this.selectedJobsLength = 0;
//         this.productsService.publishProccessedProducts(id, this.userService.getCurrentUserToken())
//             .subscribe(
//                 data => {
//                     this.getUploadHistory();
//                 }
//             )
//     }

//     saveDraft(id) {
//         this.selectedJobs = [];
//         this.selectedJobsLength = 0;
//         this.productsService.draftProccessedProducts(id, this.userService.getCurrentUserToken())
//             .subscribe(
//                 data => {
//                     this.getUploadHistory();
//                 }
//             )
//     }

//     addJob(event, job, jobNum) {
//         if(this.selectedJobs[jobNum]) {
//             this.selectedJobs[jobNum] = job;
//         }

//         let filtered = this.selectedJobs.filter(e => e instanceof Object);
//         this.selectedJobsLength = filtered.length;

//         this.displayCancel = filtered.every(e => e['status'] === 'scheduled' || e['status'] === 'processing')
//         this.displayDelete = filtered.every(e => e['status'] === 'done' || e['status'] === 'uploaded')
//         this.displayPublish = filtered.every( e =>
//             e['destination'] !== 'publish' &&
//             e['status'] === 'uploaded'
//         )
//         this.displayDraft = filtered.every(e => 
//             e['destination'] !== 'draft' &&
//             e['status'] === 'uploaded'
//             )
//     }

//     publishSelectedItems() {
//         let filtered = this.selectedJobs.filter(e => e instanceof Object);
//         let selected = filtered.map(e => e.id)

//         for(let i = 0; i < selected.length; i++) {
//             this.publish(selected[i]);
//         }
//         this.selectedJobs = [];
//         this.selectedJobsLength = 0;
//     }

//     cancelSelectedItems() {
//         let filtered = this.selectedJobs.filter(e => e instanceof Object);
//         let selected = filtered.map(e => e.id)

//         for(let i = 0; i < selected.length; i++) {
//             this.cancelJob(selected[i]);
//         }
//         this.selectedJobs = [];
//         this.selectedJobsLength = 0;
//     }

//     deleteSelectedItems() {
//         let filtered = this.selectedJobs.filter(e => e instanceof Object);
//         let selected = filtered.map(e => e.id)

//         for(let i = 0; i < selected.length; i++) {
//             this.deleteJob(selected[i]);
//         }
//         this.selectedJobs = [];
//         this.selectedJobsLength = 0;
//     }

//     draftSelectedItems() {
//         let filtered = this.selectedJobs.filter(e => e instanceof Object);
//         let selected = filtered.map(e => e.id)

//         for(let i = 0; i < selected.length; i++) {
//             this.saveDraft(selected[i]);
//         }
//         this.selectedJobs = [];
//         this.selectedJobsLength = 0;
//     }

//     onPageChanged(info:PaginationChangedEvent) {
//         this.limit = info.fetch;
//         this.offset = info.offset;
//         this.loadPage(info.fetch, info.offset)
//     }
//     loadPage(limit=null, offset=0) {
//         if (limit == null) {
//             limit = this.pagination.pageSize
//         }
//         let query = '?limit='+this.limit+'&offset='+this.offset;
//         this.productsService.getUploadHistory(query, this.userService.getCurrentUserToken())
//             .subscribe(data => {
//                 this.items = data['results'];
//                 if (!this.items.length) {
//                     this.noFiles = true;
//                 }
//                 else {
//                     this.noFiles = false;
//                 }
//                 this.pagination.totalRows = data['count'];
//             });
//     }

//     checkForActiveProcesses() {
//         if (this.items.every(e => e.status === 'processing' || e.status === 'scheduled')) {
//             return true
//         }
//         return false
//     }

// }
