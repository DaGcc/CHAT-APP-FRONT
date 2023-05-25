import { CanActivateFn, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { inject } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar";

// export const guardFn: CanActivateFn = () => {

//     //@Inject(Router) solo se usa dentro del constructor
//     //inject() es una funcion para inyectar sin la necesidad de un constructor
//     const authService: AuthService = inject(AuthService);
//     const router: Router = inject(Router);
//     const snackBar: MatSnackBar = inject(MatSnackBar);

//     console.log('guard')
//     if (authService.isAuthenticated()) {
//         return true;
//     } else {
//         snackBar.open('NO SE ENCUENTRA AUTENTICADO...', ':(', {
//             duration: 1500
//         })
//         router.navigate(['unauthorized-401']);


//         return false
//     }

// }

export const guardFn : CanActivateFn = function activeFM(){

    //@Inject(Router) solo se usa dentro del constructor
    //inject() es una funcion para inyectar sin la necesidad de un constructor
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    const snackBar: MatSnackBar = inject(MatSnackBar);

    console.log('guard')
    if (authService.isAuthenticated()) {
        return true;
    } else {
        snackBar.open('NO SE ENCUENTRA AUTENTICADO...', ':(', {
            duration: 1500
        })
        router.navigate(['unauthorized-401']);


        return false
    }

}