import { LanguageService } from './_services/language.service';
import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  language: string ;
  isBrowser: boolean;
  constructor(private langService: LanguageService,
              @Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {
    this.language = this.langService.getLanguage();
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.langService.changeLanguage(this.language);
    this.langService.currentLanguage.subscribe(lang => { 
      this.language = lang;
    })
  }
}
