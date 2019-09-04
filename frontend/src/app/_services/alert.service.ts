import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    success(message: any, keepAfterNavigationChange = false) {
            this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }
    clearAlert(keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'clear', text: null });
    }

    _error_to_string(error_msg:any){
        if (Array.isArray(error_msg)) {
            return error_msg.join(' ')
        } else if (typeof error_msg === 'object') {
            console.log(error_msg)
            for(let key in error_msg) {
                return(`${key} : ${error_msg[key]}`)
            }
        }
        else if (typeof error_msg !== 'string' && error_msg !== undefined && error_msg !== null) {
            console.log('Casting error of unknown type to string');
            console.log(error_msg);
            if (error_msg.toString) {
                return error_msg.toString()
            } else {
                return error_msg
            }
        }
        return error_msg
    }

    _get_error_text(response: any, form:any) {
        let default_error_message = 'Unknow error, please, contact support.';
        let wrong_inputs_message = 'Please, check inputs';
        var non_field_errors = [];
        var has_fields_error = false;
        let nestedControls = {};
        // try {

            // collect main errors
            if ('non_field_errors' in response.error || 'non_fields_error' in response.error) {
                if (response.error.non_field_errors) {
                    non_field_errors.push(this._error_to_string(response.error.non_field_errors))
                }
                if (response.error.non_fields_error) {
                    non_field_errors.push(this._error_to_string(response.error.non_fields_error))
                }
            }
            if ('detail' in response.error) {
                non_field_errors.push(this._error_to_string(response.error.detail))
            }
            console.log(response)
            // clear all previous errors
            if (form) {
                for (let field_name in form.controls) {
                    let control = form.controls[field_name];
                    control.setErrors(null)
                    if ( control.hasOwnProperty('controls')) {
                        nestedControls = control.controls;
                    }
                }
            }

            let flat_errors = this.make_flat_errors(response.error)
            console.log(flat_errors)
            //collect field errors
            for (let field_name in flat_errors) {

                if (!flat_errors.hasOwnProperty(field_name) && field_name === 'non_field_errors' || field_name === 'non_fields_error'
                    || field_name === 'detail' || field_name === 'code') {
                    continue
                }
                console.log("Error for field \"" + field_name + "\" is " + flat_errors[field_name])
                has_fields_error = true;
                let error_msg = this._error_to_string(flat_errors[field_name]);
                console.log(error_msg)
                console.log(field_name)
                if (form && field_name in form.controls) {
                    form.controls[field_name].setErrors({invalid: true, message: error_msg});
                    console.log("Control for \"" + field_name + "\"")
                    console.log(form.controls[field_name])
                } else if (Object.keys(nestedControls).length !== 0) {
                    let arr = field_name.split('.')
                    let value = arr[0];
                    let subvalue = arr[1];
                    if ( arr[1] in nestedControls) {
                        form.controls[value].controls[subvalue].setErrors({invalid: true, message: error_msg});
                    } else {
                        form.controls[value].setErrors({invalid: true, message: error_msg});
                    }

                } else if (Object.keys(nestedControls).length === 0) {
                    const arr = field_name.split('.')
                    const value = arr[0];
                    form.controls[value].setErrors({invalid: true, message: error_msg});
                } else {
                    non_field_errors.push(field_name + ":" + error_msg);
                }
            }
        // } catch (err) {
        //     console.error('Could not collect error messages');
        // }
        console.log(non_field_errors)
        if (Array.isArray(non_field_errors) && non_field_errors.length === 0) {
            if (has_fields_error) {
                non_field_errors = [wrong_inputs_message]
            } else {
                non_field_errors = [default_error_message]
            }
        }
        return this._error_to_string(non_field_errors)
    }
    errorProductEdit(response: any, form: any = null, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: this._get_error_text(response, form) });
    }
    errorLogin(response: any, form: any = null, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: this._get_error_text(response, form) });
    }

    errorRegistration(response: any, form: any = null, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: this._get_error_text(response, form) });
    }
    errorSendOrder(error:any) {
        if ('non_fields_error' in error) {
           return error['non_fields_error']
        }
        if ('items' in error) {
            return error['items']
        }
    }
    errorBrand(error:any) {
        if ('non_fields_error' in error) {
           return this._error_to_string( error['non_fields_error'])
        }
    }

    getMessage(): Observable<any> {
        console.log(this.subject.asObservable())
        return this.subject.asObservable();
    }

    private make_flat_errors(errors: any, prefix = "", flat_errors = null) {
        if (flat_errors === null || flat_errors === undefined) {
            flat_errors = {}
        }
        for(var key in errors){
            if (errors.hasOwnProperty(key)) {
                if (typeof errors[key] === "object" && !Array.isArray(errors[key])) {
                    this.make_flat_errors(errors[key], prefix + key + ".", flat_errors);
                } else {
                    flat_errors[prefix + key] = errors[key];
                }
            }
        }
        return flat_errors
    }
}
