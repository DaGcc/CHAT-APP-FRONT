import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Chat } from 'src/app/models/chat';
import { ChatDTO } from 'src/app/_DTOs/chatDTO';
import { ChatUsuario } from 'src/app/models/chatUsuario';

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
  // miControlAmigo: FormControl = new FormControl(undefined);
  // filteredOptionsAmigos: Observable<Usuario[]> | undefined;


  constructor(@Inject(MAT_DIALOG_DATA) public data: { idTipoChat: number, titulo: string, user: Usuario, amigos: Usuario[] },
    private authService: AuthService, private dialogRef: MatDialogRef<ChatEdicionDialogComponent>, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.formThree = new FormGroup({
      'nombreChat': new FormControl(undefined, Validators.required)
    })
    //console.log(this.data)
    if (this.data.idTipoChat === 3) {
      this.form = new FormGroup({
        'valor': new FormControl(undefined)
      })

    } else if (this.data.idTipoChat === 2) {
      //busqueda por dni
      this.formTwo = new FormGroup({
        'dni': new FormControl(undefined, [Validators.max(99999999), Validators.min(11111111)])
      })
    }
  }

  //para chat de dos
  buscarAmigo() {
    let parametroBuscador = this.data.idTipoChat===2? this.formTwo.value.dni : this.form.value.valor;
    this.authService.encontrarUsuarioPorEmilPorDniPorUsername(parametroBuscador).subscribe({
      next: (data: Usuario) => {
        // //console.log(data)
        // //console.log(this.data.amigos)
        if (data != null) {

          let estado: boolean = true;
          if (data.dni !== this.data.user.dni) {//comprobamos de que esa data sea diferente a mi
            if(this.data.idTipoChat!==3){
              for (let a of this.data.amigos) {//comprobamos si a ese usuario lo tengo agregado
                if (a.idUsuario === data.idUsuario) {
                  estado = false;
                  break; //detengo la iteracion si encontro a un amigo que coincida con el usuario buscado
                }
              }
              estado ? this.agregarListaAmigo(data) : this.snackBar.open(`${data.username} YA ESTA EN TU LISTA DE AMIGOS/CHAT`, 'AVISO', {
                duration: 2500
              });
            }else{
              this.agregarListaAmigo(data);
            }

          } else {
            let m: string = this.data.user.genero === 'M' ? "MISMO" : "MISMA";
            this.snackBar.open(`NO PUEDES AGREGARTE A TI ${m} ${this.data.user.username}`, ':v', {
              duration: 2500
            })
          }


        }
      }
    })
  }

  agregarListaAmigo(data: Usuario) {

    let bd: boolean = true;

    for (let u of this.listaAgregar) {
      if (u.dni === data.dni) {
        this.snackBar.open(`${data.username} YA ESTA EN LISTA`, 'AVISO', {
          duration: 2500
        })
        bd = false;
        break;
      }
      //  else {
      //   bd = true;
      // }
    }
    if (bd == true) {
      if(this.data.idTipoChat===3){ this.form.get('valor')?.setValue(null) }
      this.listaAgregar.push(data)
    }

    //seabilitamos si ya busco correctamente a un amigo para chat de dos
    if (this.data.idTipoChat == 2 && this.listaAgregar.length > 0 && this.listaAgregar.length <= 1) {
      this.formTwo.get('dni')?.setValue(null)  //o this.formTwo.setValue({'dni':null})
      this.formTwo.get('dni')?.disable()
    }
  }

  removerAmigo(index: number) {
    //console.log(typeof index)
    this.listaAgregar.splice(index, 1);

    if (this.data.idTipoChat == 2) {
      this.formTwo.get('dni')?.enable()
    }
  }


  crearChat() {
    let fechaISO: string
    //obtenemos la diferencia de ms de nuestra hora local hacia la hora UTC
    let dms = new Date().getTimezoneOffset() * 60000;
    let isoDate = new Date(Date.now() - dms).toISOString();
    fechaISO = isoDate;

    let chatDTO: ChatDTO = new ChatDTO();//enviaremos esto
    this.listaAgregar.push(this.data.user)
    let chat: Chat = new Chat();

    let listaChatUsuario: ChatUsuario[] = [];

    if (this.data.idTipoChat === 3) {
      chat.nombre = this.formThree.value['nombreChat'];
      chat.tipoChat.idTipoChat = 3;
      chat.fechaCreacion = fechaISO;
    } else {
      chat.tipoChat.idTipoChat = 2;
    }

    this.listaAgregar.forEach(u => {
      let chatUsusario: ChatUsuario = new ChatUsuario();
      chatUsusario.usuario = u;
      chatUsusario.fechaUnion = fechaISO
      //mejorar : evaluar si el chat es de dos o de grupo, para asignar scope
      if(this.data.idTipoChat === 2){
        chatUsusario.scopeUser = "admin"
      }else{
        if (u.idUsuario === this.data.user.idUsuario) {
          chatUsusario.scopeUser = "admin"
        } else {
          chatUsusario.scopeUser = "invitado"
        }
      }

      listaChatUsuario.push(chatUsusario)
    })
    chatDTO.chat = chat;
    chatDTO.listaChatUsuario = listaChatUsuario;


    //console.log(chatDTO)
    this.dialogRef.close(chatDTO);
    
    // chat.tipo = this.data.tipo;
    // this.listaAgregar.forEach(a => {
    //   chat.listaUser.push(a);
    // })
    // chat.listaUser.push(this.data.user);
    // //console.log(chat)
    // chatDTO.chat = chat;
    // chatDTO.user = this.data.user;
    // this.dialogRef.close(chatDTO)
  }

  /***funciones para el autocompletado***/
  filtarAmigos(val: any) {
    // //console.log(val.id != undefined && val.userName != undefined)
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
