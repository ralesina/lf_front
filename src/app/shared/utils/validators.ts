import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static validPhone(control: AbstractControl): ValidationErrors | null {
    const valid = /^\d{9}$/.test(control.value);
    return valid ? null : { invalidPhone: true };
  }
}