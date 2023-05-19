import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    hide: boolean = true;
    public formUser: FormGroup;

    constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
        this.formUser = this.fb.group({
            dni: ['', [Validators.required, Validators.min(10000000), Validators.max(99999999)]],
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15),
                             Validators.pattern('[a-zA-Z._-]*')]],
            genero: ['', Validators.required],
            rutaFoto: [''],
            email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    ngOnInit(): void {
    }

    operar(): void {

        let user = {
            dni: this.formUser.get('dni')?.value,
            username: this.formUser.get('username')?.value,
            genero: this.formUser.get('genero')?.value,
            rutaFoto: this.formUser.value['rutaFoto'],
            email: this.formUser.get('email')?.value,
            password: this.formUser.get('password')?.value,
            color: '#ff0',
            estado: true
        }

        console.log(user);

        this.snackBar.open("Registrado Exitosamente", "Éxito", {
            duration: 2000
        });
    }

}
