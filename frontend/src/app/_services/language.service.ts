import { BehaviorSubject } from 'rxjs';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

const SHOONIC_LANG = 'LANG_CODE';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public languages: any = [];
  private language = new BehaviorSubject('en');
  public currentLanguage = this.language.asObservable();

  public translations: TranslationSet = {values: {}};

  constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: any
  ) { 
    console.log(this.currentLanguage, this.language);
  }
  getLanguages() {
    return this.http.get('langs/');
  }
  getTranslation(lang_code) {
    this.http.get(`langs/${lang_code}`).subscribe(
      (data: any) => {
        let res = data;
        this.translations = res.reduce(function(map, obj) {
          if(obj.text) {
            map[obj.id] = obj.text;
          }
          else {
            map[obj.id] = obj.default_text;
          }
          return map;
        }, {});
        return this.translations;
      }
    );
  }

  translate(key: string): string {
      if(Object.keys(this.translations).length > 1) {
        if(this.translations[key]) {
          return this.translations[key];
        }
        else {
          return '';
        }
    }
}

  changeLanguage(lang_code) {
    this.language.next(lang_code);
    this.setLanguage(lang_code);
  }

  setLanguage(lang_code) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(SHOONIC_LANG, lang_code);
      this.getTranslation(lang_code);
    }
  }

  getLanguage() {
    if (isPlatformBrowser(this.platformId)) {
      let lang = localStorage.getItem(SHOONIC_LANG);
      console.log(lang);
      if (lang) {
        this.language.next(lang);
        return lang;
      } else {
        console.log('no lang');
        this.language.next('en');
        return 'en';
      }
    }
  }
}

export class TranslationSet {
  public values: {[key: string]: string} = {};
}
