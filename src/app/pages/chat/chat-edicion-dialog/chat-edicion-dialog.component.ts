import { Component, OnInit, Inject  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Chat } from 'src/app/models/chat';
import { ChatDTO } from 'src/app/_DTOs/chatDTO';

@Component({
  selector: 'app-chat-edicion-dialog',
  templateUrl: './chat-edicion-dialog.component.html',
  styleUrls: ['./chat-edicion-dialog.component.scss']
})
export class ChatEdicionDialogComponent implements OnInit {

  form!: FormGroup;
  formTwo!: FormGroup;
  formThree!: FormGroup;
  disabledFirstTab: boolean = false;
  disabledSecondTab: boolean = false;


  listaAgregar: Usuario[] = []

  /***variables para el autocompletado***/
  miControlAmigo: FormControl = new FormControl(undefined);
  filteredOptionsAmigos: Observable<Usuario[]> | undefined;
  listaAmigos: Usuario[] = []


  constructor(@Inject(MAT_DIALOG_DATA) public data: { tipo: string, titulo: string, user: Usuario, amigos: any }, private authService: AuthService,
    private dialogRef: MatDialogRef<ChatEdicionDialogComponent>, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.formThree = new FormGroup({
      'nombreChat': new FormControl(undefined, Validators.required)
    })
    console.log(this.data)
    if (this.data.tipo === 'g') {
      this.form = new FormGroup({
        'amigo': this.miControlAmigo
      })

      if (!(this.data.amigos.listaAmigos.length == 0)) {

      } else {
        this.disabledFirstTab = true;
        this.disabledSecondTab = true;
        this.form.get('amigo')?.disable();
        this.formThree.get('nombreChat')?.disable();
        let ac = this.snackBar.open('NO PUEDE CREAR UN GRUPO, INTENTE AGREGAR AMIGOS EN SU LISTA', 'OK')
        this.dialogRef.disableClose = true;
        ac.onAction().subscribe(() => {
          this.dialogRef.close();
        })
      }

    } else if (this.data.tipo === 'p') {
      //busqueda por dni
      this.formTwo = new FormGroup({
        'dni': new FormControl(undefined, [Validators.max(99999999), Validators.min(11111111)])
      })
    }

    this.listaAmigos = this.data.amigos.listaAmigos
    // this.filteredOptionsAmigos = this.miControlAmigo.valueChanges.pipe(map(val => this.filtarAmigos(val)))


  }

  buscarAndAgregarAmigo() {
    // this.userService.buscarPorDni(this.formTwo.value.dni).subscribe({
    //   next: (data: User) => {
    //     if (data != null) {
    //       if (this.data.user.dni !== data.dni) {
    //         this.agregarListaAmigo(data);
    //       } else {
    //         this.snackBar.open('NO PUEDES AGREGARTE A TI MISMO CRACK', 'AVISO', {
    //           duration: 2500
    //         })
    //       }
    //     } else {
    //       this.snackBar.open('USUARIO NO EXISTE', 'AVISO', {
    //         duration: 2500
    //       })
    //     }
    //   }
    // })
  }

  agregarListaAmigo(data: Usuario) {

    // let bd: boolean = true
    // for (let u of this.listaAgregar) {
    //   if (u.dni === data.dni) {
    //     this.snackBar.open('ESTE COMPA YA EXISTE EN TU LISTA', 'AVISO', {
    //       duration: 2500
    //     })
    //     bd = false;
    //     break;
    //   } else {
    //     bd = true;
    //   }
    // }
    // if (bd == true) {
    //   this.listaAgregar.push(data)
    // }

    // if (this.data.tipo == 'p' && this.listaAgregar.length > 0 && this.listaAgregar.length <= 1) {
    //   this.formTwo.get('dni')?.setValue(null)  //o this.formTwo.setValue({'dni':null})
    //   this.formTwo.get('dni')?.disable()
    // }
  }

  removerAmigo(index: number) {
    // console.log(typeof index)
    // this.listaAgregar.splice(index, 1);

    // if (this.data.tipo == 'p') {
    //   this.formTwo.get('dni')?.enable()
    // }
  }


  crearChat() {
    // let chatUserDto: ChatDTO = new ChatDTO();
    // let chat: Chat = new Chat();
    // chat.nombre = this.formThree.value['nombreChat'];


    // chat.tipo = this.data.tipo;
    // this.listaAgregar.forEach(a => {
    //   chat.listaUser.push(a);
    // })
    // chat.listaUser.push(this.data.user);
    // console.log(chat)
    // chatUserDto.chat = chat;
    // chatUserDto.user = this.data.user;
    // this.dialogRef.close(chatUserDto)
  }

  /***funciones para el autocompletado***/
  filtarAmigos(val: any) {
    // console.log(val.id != undefined && val.userName != undefined)
    // if (val.id != undefined) {
    //   return this.listaAmigos.filter(a => {
    //     return a.username?.toLowerCase().includes(val.userName.toLowerCase()) || a.dni?.toString().includes(val.dni?.toString())
    //   })
    // } else {
    //   return this.listaAmigos.filter(a => {
    //     return a.username?.toLowerCase().includes(val.toLowerCase()) || a.dni?.toString().includes(val.toLowerCase())
    //   })
    // }
  }
  displayFn(user: Usuario) {
    return user ? `${user.username}` : user;
  }

}
