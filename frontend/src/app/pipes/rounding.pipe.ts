import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rounding'
})
export class RoundingPipe implements PipeTransform {
    transform(value: number, args?: any): number {
        return Math.round(value * 100) / 100;
    }
}

@Pipe({
    name: 'dateVal'
})
export class DateVal implements PipeTransform {
    transform(value: string, args?: any): any {
        const arr = value.split('-');
        let date = arr[2].substr(0, 2)
        return date + '/' + arr[1] + '/' + arr[0];
    }
}
@Pipe({
    name: 'dateValPoint'
})
export class DateValPoint implements PipeTransform {
    transform(value: string, args?: any): any {
        const arr = value.split('-');
        let date = arr[2].substr(0, 2)
        return date + '.' + arr[1] + '.' + arr[0];
    }
}
@Pipe({
    name: 'replaceLineBreaks'
})
export class ReplaceLineBreaks implements PipeTransform {
transform(value: string): string {
      return value.replace(/\n/g, '<br/>');
   }
}

@Pipe({
    name: 'replaceLongLine'
})
    export class ReplaceLongLine implements PipeTransform {
    transform(value: string): string {
        if (value.length > 15 && (/\S/.test(value))) {
            const arr = value.match(/(.{1,15})/gim);
            return arr.join(' ')

        } else {return value};
    }
}

@Pipe({ name: 'ObjNgFor',  pure: false })
export class ObjNgFor implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        return Object.keys(value).sort(function(a: any, b: any) {
            return (+a) - (+b);
        });
    }
}
