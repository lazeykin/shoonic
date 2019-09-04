import { e } from "@angular/core/src/render3";

export class CustomValidator {
// Validates URL
    static urlValidator(url): any {
        if (url.pristine) {
            return null;
        }
        if (url.value === '') {
            return null;
        }
        const URL_REGEXP = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
        url.markAsTouched();
        if (URL_REGEXP.test(url.value)) {
            return null;
        }
        return {
            invalidUrl: true
        };
    }
    static integer(control) {
        if (control.pristine) {
            return null;
        }
        if (Number.isInteger(control.value) ||  control.value === null) {
            return null;
        }
        return {
            invalidNumber: true
        };
    }
    static hasSpace(control) {
        if (control.pristine) {
            return null;
        }
        if (/\s/.test(control.value)) {
            return {
                invalidUrlSpace: true
            }
        }
        return null
    }
    static matchAdress(control) {
        if (control.pristine) {
            return null;
        }
        if (control.value === 'login') {
            return {
                invalidMatch: true
            }
        }
        return null
    }
    static isPositive(control) {
        if (control.pristine) {
            return null;
        }
        const regExp = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
        if (regExp.test(control.value)) {
            return null
        }
        return {
            notPositive: true
        }
    }
    static checkSizes(control) {

        if (Object.keys(control.value).length !== 0 ) {
            return null;
        }
        return {
            invalidSizes: true
        };
    }

    static tags(x): any {
        if (x.pristine) {
            return null;
        }
        let arr = x.value.split(/[ ,]+/);
        if(arr.every(e => /^[\w]*[\w_\d]*$/.test(e)) && arr.length < 6) {
            return null;
        }
        else if (arr.some(e => !/^[\w]*[\w_\d]*$/.test(e))) {
            return {
                mustBeAlphabetic: true
            }
        }
        else if (arr.length > 5) 
            return {
                invalidTags: true
            }
    }
    static  emptyArray(control) {
       if (control.value[0].name === '') {
           return {
               emptyArray: true
           }
       }
       return null
    }
    // static noSizes(x): any {
    //     console.log(x);
    //     let sum = 0;
    //      for (let el in x.value) {
    //         if ( x.value.hasOwnProperty( el ) && x.value[el] !== '' ) {
    //              sum += Number( x.value[el] );
    //         }
    //      }
    //      console.log(sum)
    //      if (sum === 0 || x.value === null) {
    //          return {
    //              invalidSizes: true
    //          }
    //      } else {
    //          return null;
    //      }
    //
    // }
    //validate select
    static selectMiss(select) {
        if(select.value.length) {
            return null;
        }
       if(!select.value.length) {
            return {
                invalidSelect: true
            }
        }

    }
// Validates passwords
    static matchPassword(group): any {
        const password = group.controls.password;
        const confirm = group.controls.password_confirm;
        if (!(password.dirty || password.dirty) || !(confirm.dirty || confirm.dirty)) {
            return null;
        }
       group.markAsTouched();
        if (password.value === confirm.value) {
            return null;
        }
        return {
            invalidPassword: true
        };
    }

    static checkDiscount(group) : any {
        let price = group.controls.price;
        let discountPrice = group.controls.discount_price;

        if (price.pristine && discountPrice.pristine) {
            return null;
        }
        
        if(discountPrice.value >= price.value) {
            group.markAsTouched();
            return {
                invalidDiscount: true
            }
        }

        return null;
    }
   static checkMinimalPrice(group): any {
       const minPrice = group.controls.minimal_price;
       const price = group.controls.price;
       if (price.pristine && minPrice.pristine) {
           return null;
       }

       if(minPrice.value > price.value) {
           group.markAsTouched();
           return {
               invalidMinPrice: true
           }
       }

       return null;
   }
    static checkForLessRecomenPrice(group): any {
        const recomRetailPrice = group.controls.recommended_retail_price;
        const minPrice = group.controls.minimal_price;
        if (recomRetailPrice.pristine && minPrice.pristine) {
            return null;
        }
        if (minPrice.value > recomRetailPrice.value && recomRetailPrice.value) {
            group.markAsTouched();
            return {
                invalidRecomRetailPrice: true
            }
        }

        return null;
    }

    static checkForLessPromoPrice(group): any {
        const minPrice = group.controls.minimal_price;
        const discountPrice = group.controls.discount_price;
        if (discountPrice.pristine && minPrice.pristine) {
            return null;
        }

        if (minPrice.value > discountPrice.value && discountPrice.value) {
            group.markAsTouched();
            return {
                invalidDiscountPrice: true
            }
        }

        return null;
    }
    
// Validates numbers
    static numberValidator(number): any {
        if (number.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;
        number.markAsTouched();
        if (NUMBER_REGEXP.test(number.value)) {
            return null;
        }
        return {
            invalidNumber: true
        };
    }
    // Date
    static date(date: any) {
        if (date.pristine) {
            return null;
        }
        const RegExp = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
        date.markAsTouched();
        if (RegExp.test(date.value)) {
            return null;
        }
        return {
            invalidData: true
        };
    }
// Validates US SSN
    static ssnValidator(ssn): any {
        if (ssn.pristine) {
            return null;
        }
        const SSN_REGEXP = /^(?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
        ssn.markAsTouched();
        if (SSN_REGEXP.test(ssn.value)) {
            return null;
        }
        return {
            invalidSsn: true
        };
    }
    // Validates zip codes
    static zipCodeValidator(zip): any {
        if (zip.pristine) {
            return null;
        }
        // const ZIP_REGEXP = /^[0-9]{5}(?:-[0-9]{4})?$/;
        const ZIP_REGEXP = /^[0-9]{4,6}$/;
        zip.markAsTouched();
        if (ZIP_REGEXP.test(zip.value)) {
            return null;
        }
        return {
            invalidZip: true
        };
    }
    // Phone number
    static phoneNumber(value): any {
        if (value.pristine) {
            return null;
        }
        const ZIP_REGEXP = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        value.markAsTouched();
        if (ZIP_REGEXP.test(value.value)) {
            return null;
        }
        return {
            invalidPhone: true
        };
    }
}
