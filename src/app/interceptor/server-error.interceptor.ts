import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, retry, tap } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(private snackBar: MatSnackBar) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(environment.REINTENTOS)).
            pipe(tap(event => {
                if (event instanceof HttpResponse) { 
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        throw new Error(event.body.errorMessage);//error lanzado
                    }/*else{
                            this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });    
                        }*/
 
                }
                //este catchError es disparado si es que se lanzo algun error 
            })).pipe(catchError((err) => {
                console.log(err);

                if (err.status === 400) {
                    this.snackBar.open(err.error.mensaje, "ERROR 400", { duration: 5000 })
                    if (!err.error.mensaje) {
                        this.snackBar.open('CREDENCIALES INCORRECTAS', "Uy :(", { duration: 5000 })
                    }
                } else if (err.status === 404) {
                    this.snackBar.open(err.error.mensaje, "ERROR 404", { duration: 5000 })
                } else if (err.status === 500) {
                    this.snackBar.open(err.message, "ERROR 500", { duration: 5000 })
                } else {
                    this.snackBar.open(err.message, "ERROR", { duration: 5000 })
                }
                //esto para retornar un obserbable vacio por que este metodo necesita que retornes un observable

                return EMPTY;
            }));

    }
}
