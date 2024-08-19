import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export type MyErrorsOptions = { km: string; en: string };
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class CustomValidators extends Validators {
  static autoTips: Record<string, Record<string, string>> = {
    km: {
      required: 'ទាមទារការបញ្ចូល!',
    },
    en: {
      required: 'Input is not required!',
    },
    default: {},
  };
  static nameMaxLengthValidator(maxLength: number = 500): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return {
        maxlength: {
          km: `មិនត្រូវសរសេរលើសពី ${maxLength}អក្សរ!`,
          en: `Must not exceed ${maxLength} characters!`,
        },
      };
    };
  }
}
