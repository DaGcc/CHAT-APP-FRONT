import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formUser: FormGroup;
  hide = true;

  email: FormControl = new FormControl('', [Validators.email, Validators.required]);
  password: FormControl = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder) { 
    this.formUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  operar(): void{
    console.log(this.formUser.value['email'] + ' ' + this.formUser.value['password']);
  }

}
