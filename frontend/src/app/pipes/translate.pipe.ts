import { LanguageService } from './../_services/language.service';
import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {
    constructor(private langService: LanguageService){}

    transform(value: any, args?: any): any {
        return this.langService.translate(value);
    }
}

