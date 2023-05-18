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

  dni: FormControl = new FormControl('', [Validators.required, Validators.min(100000000),
                                          Validators.max(99999999)]);
  username: FormControl = new FormControl('', [Validators.required, Validators.minLength(3),
                                               Validators.maxLength(15)]);
  rutaFoto: FormControl = new FormControl('');
  genero: FormControl = new FormControl('', Validators.required);
  email: FormControl = new FormControl('', [Validators.email, Validators.required]);
  password: FormControl = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder) {
    this.formUser = this.fb.group({
      dni: ['', [Validators.required, Validators.min(10000000), Validators.max(99999999)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      genero: ['', Validators.required],
      rutaFoto: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
   }

  ngOnInit(): void {
  }

  operar(): void{
    console.log(this.formUser.value['username'] + ' ' + 
    this.formUser.value['password'] + ' ' + this.formUser.value['genero'] + ' ' + 
    this.formUser.value['rutaFoto']);
  }

}
