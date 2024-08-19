import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export type MyErrorsOptions = { kh: string; en: string };
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class CustomValidators extends Validators {
  static autoTips: Record<string, Record<string, string>> = {
    kh: {
      required: 'ទាមទារការបញ្ចូល!',
    },
    en: {
      required: 'Input is required!',
    },
    default: {},
  };
}
