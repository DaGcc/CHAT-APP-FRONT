import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-auth-record',
    templateUrl: './auth-record.component.html',
    styleUrls: ['./auth-record.component.scss']
})
export class AuthRecordComponent implements OnInit {


    hide: boolean = true;
    public formUser: FormGroup;
    email: FormControl = new FormControl(undefined, [Validators.email, Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]);


    constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private authService: AuthService, private router: Router) {
        this.formUser = this.fb.group({
            dni: [undefined, [Validators.required, Validators.min(10000000), Validators.max(99999999)]],
            username: [undefined, [Validators.required, Validators.minLength(3), Validators.maxLength(15),
            Validators.pattern('[a-zA-Z._-]*')]],
            genero: [undefined, Validators.required],
            email: this.email,
            password: [undefined, [Validators.required]]
        });
    }

    ngOnInit(): void {
    }

    getErrorMessage() {
        if (this.email.hasError('required')) {
            return 'Tiene que ingresar un email';
        }
        return this.email.hasError('email') ? 'Email no valido' : '';
    }


    operar(): void {

        let user: Usuario = new Usuario();

        user.dni = this.formUser.get('dni')?.value,
            user.username = this.formUser.get('username')?.value,
            user.genero = this.formUser.get('genero')?.value,
            user.email = this.formUser.get('email')?.value,
            user.password = this.formUser.get('password')?.value,
            user.estado = true


        // console.log(this.archivos![0]);
        if (this.archivos?.length === 0 || this.archivos == undefined) {
            this.authService.crearUsuaio(user).subscribe({
                next: (data: Usuario) => { 
                    console.log(data) 
                    this.redireccion();
                }
            })
        } else {
            this.authService.guardarConImg(user, this.archivos[0]).subscribe({
                next: (data: Usuario) => { 
                    console.log(data) 
                    this.redireccion();
                }
            })
        }


    }


    redireccion() {
        this.snackBar.open("Registrato Exitosamente", "Éxito", {
            duration: 2000
        });
        setTimeout(()=>{
            this.snackBar.open("Redirigiendo al login...", ";)", {
                duration: 2000
            });
            this.router.navigate(['/login'])
        },1000)
        
    }

    archivos: FileList | undefined
    seleccionarImg(e: any) {
        this.archivos = e.target.files
        console.log(this.archivos)
    }
}
