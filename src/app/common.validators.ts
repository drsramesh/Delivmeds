// Importing Internal modules
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DelivMedsAuthService } from './services/deliv-meds-auth.service';

  // function for to compare passwords

export function matchPassword(AC: AbstractControl) {
  let password = AC.get('newpassword').value; // to get value in input tag
  let confirmPassword = AC.get('confirmpassword').value; // to get value in input tag
  if (password !== confirmPassword) {
    AC.get('confirmpassword').setErrors({ MatchPassword: true })
  } else {
    return null
  }
}