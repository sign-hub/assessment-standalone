import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[passwordConfirm][formControlName],[passwordConfirm][formControl],[passwordConfirm][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => PasswordConfirm), multi: true }
    ]
})
export class PasswordConfirm implements Validator {
    constructor( @Attribute('passwordConfirm') public validateEqual: string) {
    }

    validate(c: AbstractControl): { [key: string]: any } {
        const v = c.value;

        // control vlaue
        const e = c.root.get(this.validateEqual);

        // value not equal
        if (e && v != e.value) {
            return {
                validateEqual: false
            };
        }
        return null;
    }

}
