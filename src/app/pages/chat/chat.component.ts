import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RippleAnimationConfig } from '@angular/material/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from 'src/app/models/mensaje';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';
import { ChatService } from './../../services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { Chat } from 'src/app/models/chat';
import { map, EMPTY, forkJoin, switchMap } from 'rxjs';
import { ChatDTO } from 'src/app/_DTOs/chatDTO';
import { ChatUsuarioEspDTO } from 'src/app/_DTOs/chatUsuariosEspDTO';
import { ChatEdicionDialogComponent } from './chat-edicion-dialog/chat-edicion-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MensajeService } from 'src/app/services/mensaje.service';
import { NotificacionUser } from 'src/app/_DTOs/notificacionUser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {


  RippleAnimationConfing: RippleAnimationConfig = { enterDuration: 600, exitDuration: 500 };


  //cliente STOMP -------------------------------------------
  cliente: Client = new Client();
  sockJS: any = new SockJS('http://localhost:8080/broker');
  suscripcionChat: any;
  suscripcionNotificacion: any
  //---------------------------------------------------------


  //PARA ELEMENTOS DEL DOM ----------------------------------
  @ViewChild('scrollMe') private scrollConteiner!: ElementRef; //tambien se puede usar Element
  RippleAnimationConfig: RippleAnimationConfig = { enterDuration: 700, exitDuration: 800 };
  colorRiple: string = 'rgba(102, 30, 237, .2)'
  contGroup: any
  //---------------------------------------------------------


  //VARIABLES------------------------------------------------
  jsonUserStorage: string = sessionStorage.getItem(environment.USUARIO) || '{"idUsuario":2,"nombre":"two","estado":true,"email":"userTwo@gmail.com","password":"123","color":"#5800ff"}'; //temporal
  user: Usuario = new Usuario();
  listaUserAmigo: Usuario[] = []
  listaChatUsuarioEspDTO: ChatUsuarioEspDTO[] = [];
  misChats: Chat[] = [];
  chatUsuarioEspDTO: ChatUsuarioEspDTO = new ChatUsuarioEspDTO();
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = []
  chatPrivado: boolean | undefined;
  //---------------------------------------------------------

  notificacion: { idChat: number, detalle: string } | undefined

  scrollButton() {
    //nativeElement que representa el elemento HTML actual.
    // console.log(this.scrollConteiner)
    // console.log(this.scrollConteiner!.nativeElement.scrollTop)
    // console.log(this.scrollConteiner!.nativeElement.scrollHeight)
    // console.log(this.scrollConteiner!.nativeElement.clientHeight)

    setTimeout(() => {
      this.scrollConteiner!.nativeElement.scrollTop = this.scrollConteiner!.nativeElement.scrollHeight;
    }, 100)

    // this.scrollConteiner!.nativeElement.scrollTop = this.scrollConteiner!.nativeElement.scrollHeight - this.scrollConteiner!.nativeElement.clientHeight;

    /*CON INTERFAZ NATIVA DE TS/JS "Element"
    this.scrollConteiner!.scrollTop = this.scrollConteiner!.scrollHeight; 
    pero es menos seguro de inyectar
    */
    /*RAZON: 
La razón por la cual usar Element en lugar de ElementRef puede ser menos seguro es porque ElementRef es
una abstracción de Element que está diseñada específicamente para el uso en Angular.
Cuando se utiliza ElementRef, se obtiene una referencia segura al elemento HTML real del DOM y Angular se encarga de actualizar el elemento de manera adecuada
y segura dentro del ciclo de vida de Angular. Además, ElementRef también proporciona acceso a métodos útiles como nativeElement, que permite acceder a
la instancia real del elemento HTML.
Por otro lado, al utilizar directamente Element, se está trabajando con el objeto del DOM real y se pierde la capa adicional de seguridad y encapsulamiento 
que proporciona Angular. Esto puede llevar a problemas de seguridad si se modifica el DOM directamente o si no se maneja adecuadamente 
el ciclo de vida de Angular.
En resumen, utilizar ElementRef en lugar de Element es una buena práctica en Angular ya que proporciona una capa adicional de seguridad y
encapsulamiento para trabajar con el DOM de manera segura y efectiva.
    */
  }

  constructor(private chatService: ChatService, private authService: AuthService, private dialog: MatDialog, private overlay: Overlay,
    private snackBar: MatSnackBar, private mensajeService: MensajeService) { }


  ngOnDestroy(): void {
    this.desconectar();
  }


  ngOnInit(): void {

    this.user = this.authService.obtenerCredencialesUserstorage();
    this.cargarChatUser(this.user.idUsuario);

    this.contGroup = document.getElementById('listChat');
    // console.log(JSON.parse(this.jsonUserStorage) as Usuario)
    this.user = (JSON.parse(this.jsonUserStorage) as Usuario);

    this.conectar();
    //RETORNA EL SOCKJS PARA NO USAR EL WEBSOCKET NATIVO DEL HTML
    // this.cliente.webSocketFactory = () => {//SE EJECUTARA LUEGO DE ACTIVAR o ENTRAR EN CONTACATO CON EL SERVIDOR
    //   // console.log('ff')
    //   return this.sockJS;

    // }
    this.logica();
  }

  conectar() {
    this.cliente.activate();
  }

  desconectar() {
    this.cliente.deactivate();
    this.cliente == undefined;
  }

  //LOGICA DESPUES DE CONECTARNOS CON EL EVENTO
  logica() {
    this.cliente.webSocketFactory = () => {
      return this.sockJS;
    }
    //METODO/ENVENTO QUE EJECUTARA LAS SUBSCRIPCIONES CUANDO NOS CONECTEMOS
    this.cliente.onConnect = frame => {
      console.log(frame + "on")

      // console.log(this.mensaje)

      this.cliente.subscribe(`/chat/chat-actualizado/${this.user.idUsuario}`, data => {
        console.log("actualizando")
        console.log(data.body)
        this.cargarChatUser(this.user.idUsuario);
      })

      this.suscripcionChat = this.cliente.subscribe(`/chat/mensaje/${this.chatUsuarioEspDTO.chat.idChat}`, (e) => {
        let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
        mensaje.fecha = new Date(mensaje.fecha!);
        console.log(this.chatUsuarioEspDTO?.chat.idChat);
        this.mensajes.push(mensaje);
        this.mensaje.texto = undefined;
        this.scrollButton();
      });

      this.notificacionFn();

      this.cliente.subscribe(`/chat/escribiendo/12`, e => {
        console.log('ejecuto escritura')
        console.log(e.body)
        this.write = e.body
      })
    };

    //METODO/ENVENTO QUE EJECUTARA LAS SUBSCRIPCIONES CUANDO NOS DESCONECTEMOS
    this.cliente.onDisconnect = (frame) => {
      console.log(frame + "of")
    }

  }


  notificacionFn() {
    // console.log(this.misChats)
    // console.log(this.listaChatUsuarioEspDTO)

    //esto solo iterara al inicio
    this.listaChatUsuarioEspDTO.forEach((c, i) => {
      //crea subscripciones multiples con diferentes idChat, por ende, cuando mande notiicaciones a un chat determinado este buscara dicha subcripcion
      this.suscripcionNotificacion = this.suscripcionChat = this.cliente.subscribe(`/chat/notificar/${c.chat.idChat}`, data => {

        console.log(i)
        if (data.body === 'N') {
          console.log(data.body)
          this.listaChatUsuarioEspDTO[i].chat.notificacion = 'N'
          console.log(this.listaChatUsuarioEspDTO[i].chat.notificacion)
        } else if(data.body===""){  
          this.listaChatUsuarioEspDTO[i].chat.notificacion = undefined        
          // console.log(data.body + "en" + c.chat.idChat)
        } else {
          this.listaChatUsuarioEspDTO[i].chat.notificacion = data.body          
          // console.log(data.body + "en" + c.chat.idChat)
        }

        // this.notificacion!.detalle = data.body;

      })
    })

    console.log(this.listaChatUsuarioEspDTO)

  }


  enviarMensaje() {
    let chat = this.chatUsuarioEspDTO?.chat;
    chat.listaMensajes = []
    this.mensaje.chat = chat;
    this.mensaje.usuario = this.user
    this.mensaje.tipo = 'M'

    // console.log(this.suscripcionChat)
    // Publicar el mensaje
    this.cliente.publish({
      destination: '/app/mensaje',
      body: JSON.stringify(this.mensaje)
    });

    let ue = new NotificacionUser();
    ue.chat = this.chatUsuarioEspDTO!.chat;
    ue.usuario = this.user;
    ue.tipo = "N";

    this.cliente.publish({
      destination: '/app/notificar',
      body: JSON.stringify(ue)
    })
  }

  write: string | undefined

  escribiendo(texto: any) {
    // this.suscripcionNotificacion.unsubscribe();
    let ue = new NotificacionUser();
    ue.chat = this.chatUsuarioEspDTO!.chat;
    ue.usuario = this.user;
    ue.tipo = "E";
    // console.log(ue)

    if (texto.trim() === '') {
      ue.tipo = "NADA";
    } 

    this.cliente.publish({
      destination: '/app/notificar',
      body: JSON.stringify(ue)
    })


    // this.notificacionFn();
  }





  cambiarEstadoUser(est: boolean) {

  }


  toggleListChat() {

    if (this.contGroup?.classList.contains('cont-groups-ts')) {
      this.contGroup?.classList.remove('cont-groups-ts')
    } else {
      this.contGroup?.classList.add('cont-groups-ts')
    }
  }

  /**************************************/
  /************SERVICIOS REST************/
  /**************************************/
  cargarChatUser(idUserFn: number) {
    this.chatPrivado = false;
    this.listaUserAmigo = [];

    this.chatService.listarChatDeUsuario(idUserFn).pipe(switchMap((data: Chat[]) => {
      //aqui me va a botar un arreglo de usuarios de un chat, entondes si hay muchos chats seria usuario[][], por cada chat hay un arreglo de usuario
      this.misChats = data;
      console.log(this.misChats)
      const observables = data.map(chat => this.chatService.listarUsuariosDeChat(chat.idChat));//[]
      return forkJoin(observables).pipe(
        map((response: Usuario[][]) => {
          console.log(response)
          return data.map((chat, index) => {
            const cudEspdto: ChatUsuarioEspDTO = new ChatUsuarioEspDTO();
            cudEspdto.chat = chat;
            cudEspdto.listaUsuario = response[index];
            return cudEspdto;
          });
        })
      );
    })
    ).subscribe({
      next: (data: ChatUsuarioEspDTO[]) => {
        console.log(data)
        this.listaChatUsuarioEspDTO = data.map(cu => {
          if (cu.chat.tipoChat?.idTipoChat === 1) {
            this.chatPrivado = true;//para desabilitar la opcion de crear chat privados, por si ya tiene uno
          }
          return {
            chat: cu.chat,
            listaUsuario: cu.listaUsuario.filter(u => {
              //se evalua solo si el chat es de dos y que el is de ese usuario sea diferente al mio
              if (cu.chat.tipoChat?.idTipoChat === 2 && u.idUsuario !== this.user.idUsuario) {
                this.listaUserAmigo.push(u)//se agrega a lista de amigos en comun
              }
              return u.idUsuario !== this.user.idUsuario

            })
          };
        });
        // console.log(this.listaChatUsuarioEspDTO)
        // console.log(this.listaUserAmigo)
      }
    });

  }

  page: number = 0
  cargarMensajeChat(idChat: number) {
    this.suscripcionChat.unsubscribe();

    this.chatUsuarioEspDTO = this.listaChatUsuarioEspDTO.find(cu => {
      return cu.chat.idChat === idChat
    })!
    console.log(this.chatUsuarioEspDTO)
    // this.chatUsuarioEspDTO = JSON.parse(JSON.stringify(lc[0])) as ChatUsuarioEspDTO;
    // console.log({...lc})

    // this.chatUsuarioEspDTO = {...lc};
    this.mensajeService.listarChatPaginado(idChat, this.page, 100).subscribe({
      next: (data: any) => {
        this.mensajes = data.content as Mensaje[];
        this.suscripcionChat = this.cliente.subscribe(`/chat/mensaje/${this.chatUsuarioEspDTO.chat.idChat}`, (e) => {
          let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
          mensaje.fecha = new Date(mensaje.fecha!);
          console.log(this.chatUsuarioEspDTO?.chat.idChat);
          this.mensajes.push(mensaje);
          this.mensaje.texto = undefined;
          this.scrollButton();
        });
        this.scrollButton();
        // console.log(this.mensajes)
      }
    });

  }


  addchat(idTipoChat: number) {
    // let a : Amigos = this.amigos?.id!=null? this.amigos : new Amigos();
    // let data : {tipo:string,titulo:string,user: Usuario,amigos:any} por el momento se pensaja lo de amigos como recursividad
    let data: { idTipoChat: number, titulo: string, user: Usuario, amigos: Usuario[] }

    //para crear chats grupales o con un amigo
    if (idTipoChat !== 1) {

      switch (idTipoChat) {
        case 2: {
          data = { idTipoChat: 2, titulo: 'Crear chat con un amigo', user: this.user, amigos: this.listaUserAmigo }
          break;
        }
        case 3: {
          data = { idTipoChat: 3, titulo: 'Crear grupo', user: this.user, amigos: this.listaUserAmigo }
          break;
        }
        default: {
          break
        }
      }
      // console.log(data!)
      const dialog = this.dialog.open(ChatEdicionDialogComponent, {
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        autoFocus: false,
        // disableClose: true,
        data: data!
      })
      dialog.afterClosed().subscribe((data: ChatDTO) => {
        console.log(data)

        if (data) {
          this.snackBar.open('CREANDO CHAT', 'AVISO', {
            duration: 2000
          })
          // console.log(data)
          this.cliente.publish({
            destination: `/app/chat-actualizado`,
            body: JSON.stringify(data)
          })
        } else {
          this.snackBar.open('NO CREASTE EL CHAT', 'AVISO', {
            duration: 2000
          })
        }
      })
    } else {
      if (this.chatPrivado) {
        this.snackBar.open('YA TIENES CREADO UN CHAT PRIVADO', 'AVISO', {
          duration: 2000
        })
      } else {
        this.snackBar.open('CREANDO CHAT PRIVADO', 'AVISO', {
          duration: 2000
        })
      }
    }

  }

}


/**PONER EL CONTENEDOR DE CHATS-MSJ CON UNA ALTUTA TOTAL Y EL HIJO QUE TOME UN DETERMINADO TAMAÑO(80%) Y MODIFICAR LA SECCION DE ACCIONES
 * PARA DARLE UN EFECTO FLOTANTE 
 */