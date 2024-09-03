import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export type MyErrorsOptions = { km: string; en: string };
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class CustomValidators extends Validators {
  static autoTips: Record<string, Record<string, string>> = {
    km: {
      required: 'ទាមទារការបញ្ចូល!',
    },
    en: {
      required: 'Input is required!',
    },
    default: {},
  };

  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isValid = emailPattern.test(control.value);

    if (!isValid) {
      return {
        emailValidator: {
          km: `អុីមែលមិនត្រឹមត្រូវ!`,
          en: `Email is not valid!`,
        },
      };
    }

    return null;
  }
}
