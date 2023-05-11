import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  hide: boolean = true;
  formUser: FormGroup;

  username: FormControl = new FormControl('', Validators.required);
  email: FormControl = new FormControl('', [Validators.email, Validators.required]);
  password: FormControl = new FormControl('', Validators.required);
  confimPassword: FormControl = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder) {
    this.formUser = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
   }

  ngOnInit(): void {
  }

  operar(): void{
    console.log(this.formUser.value['username'] + ' ' + this.formUser.value['password']);
  }

}
