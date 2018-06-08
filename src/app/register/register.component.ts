import { Component, OnInit } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signInForm: FormGroup;
  createuser: any = {};
  mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


  constructor(
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.signInForm = this._fb.group({
    signinEmail: new FormControl(null, Validators.required),
    username: new FormControl(null, Validators.required),
    inPassword: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    address1: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required),
    state: new FormControl(null, Validators.required),
     phonenumber: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
    //  zipcode : [null, Validators.compose([Validators.required, Validators.maxLength(5)])]
    zipcode: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(5)])),
    signinPassword:  new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(8), Validators.pattern(/^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{1,20}/)]))
     });
   console.log('login');
  }

}
