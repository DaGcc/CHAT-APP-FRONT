import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RippleAnimationConfig } from '@angular/material/core';
import { Client, IFrame } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from 'src/app/models/mensaje';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';
import { ChatService } from './../../services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { Chat } from 'src/app/models/chat';
import { ChatUsuario } from 'src/app/models/chatUsuario';
import { map, EMPTY, forkJoin, switchMap } from 'rxjs';
import { ChatDTO } from 'src/app/_DTOs/chatDTO';
import { ChatUsuarioEspDTO } from 'src/app/_DTOs/chatUsuariosEspDTO';
import { ChatEdicionDialogComponent } from './chat-edicion-dialog/chat-edicion-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy{


  RippleAnimationConfing: RippleAnimationConfig = { enterDuration: 600, exitDuration: 500 };


  //cliente STOMP -------------------------------------------
  cliente: Client = new Client();
  sockJS: any = new SockJS('http://localhost:8080/broker');
  //---------------------------------------------------------


  //PARA ELEMENTOS DEL DOM ----------------------------------
  @ViewChild('scrollMe') private scrollConteiner!: ElementRef ; //tambien se puede usar Element
  RippleAnimationConfig: RippleAnimationConfig = { enterDuration: 700, exitDuration: 800 };
  colorRiple: string = 'rgba(102, 30, 237, .2)'
  contGroup: any
  //---------------------------------------------------------


  //VARIABLES------------------------------------------------
  jsonUserStorage : string = sessionStorage.getItem(environment.USUARIO) || '{"idUsuario":2,"nombre":"two","estado":true,"email":"userTwo@gmail.com","password":"123","color":"#5800ff"}'; //temporal
  user: Usuario = new Usuario();
  listaChatUsuarioEspDTO: ChatUsuarioEspDTO[] = [];
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = []
  chatPrivado: boolean = false;
  //---------------------------------------------------------

  scrollButton() {
    //nativeElement que representa el elemento HTML actual.
    // console.log(this.scrollConteiner)
    // console.log(this.scrollConteiner!.nativeElement.scrollTop)
    // console.log(this.scrollConteiner!.nativeElement.scrollHeight)
    // console.log(this.scrollConteiner!.nativeElement.clientHeight)
  
    setTimeout(()=>{
      this.scrollConteiner!.nativeElement.scrollTop = this.scrollConteiner!.nativeElement.scrollHeight;
    },100)

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

  constructor( private chatService : ChatService, private authService : AuthService, private dialog : MatDialog,private overlay: Overlay,
    private snackBar: MatSnackBar ) { }

  // ngAfterViewChecked(): void {
   
  // }

  ngOnDestroy(): void {
    this.desconectar();
  }


  ngOnInit(): void {
    this.user = this.authService.obtenerCredencialesUserstorage();


    //analizar mas :,v , solo se que hayu n arreglo dentro de otro arreglo
    this.chatService.listarChatDeUsuario(this.user.idUsuario).pipe(switchMap((data: Chat[]) => {
      //aqui me va a botar un arreglo de usuarios de un chat, entondes si hay muchos chats seria usuario[][], por cada chat hay un arreglo de usuario
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
        this.listaChatUsuarioEspDTO = data.map(cu => {
          if(cu.chat.tipoChat?.idTipoChat===1){
            this.chatPrivado=true;//para desabilitar la opcion de crear chat privados, por si ya tiene uno
          }
          return {
            chat: cu.chat,
            listaUsuario: cu.listaUsuario.filter(u => u.idUsuario !== this.user.idUsuario )
          };
        });
        console.log(this.listaChatUsuarioEspDTO)
      }
    });


    this.contGroup = document.getElementById('listChat');
    // console.log(JSON.parse(this.jsonUserStorage) as Usuario)
    this.user = (JSON.parse(this.jsonUserStorage) as Usuario);
    this.mensaje.texto = this.user.username;
    this.mensaje.texto = this.user.color;

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
  }

  //LOGICA DESPUES DE CONECTARNOS CON EL EVENTO
  logica() {
    this.cliente.webSocketFactory = () => {
      return this.sockJS;
    }
    //METODO/ENVENTO QUE EJECUTARA LAS SUBSCRIPCIONES CUANDO NOS CONECTEMOS
    this.cliente.onConnect = frame => {
      console.log(frame+ "on")


      this.mensaje.tipo = 'NUEVO_USUARIO'
      // console.log(this.mensaje)
      
      this.cliente.publish({
        destination: '/app/mensaje',
        body: JSON.stringify(this.mensaje)
      })

      this.cliente.subscribe('/chat/mensaje', e => {
        let mensaje: Mensaje = JSON.parse(e.body) as Mensaje; //castig por que el broke devuelve tipo String y lo nesecitamos a tipo Mensaje
        mensaje.fecha = new Date(mensaje.fecha!)
        // console.log(mensaje)
        this.mensajes.push(mensaje)
        this.scrollButton();
      })



      this.cliente.subscribe('/chat/escribiendo', e => {
        console.log('ejecuto escritura')
        console.log(e.body)
      })
    };



    //METODO/ENVENTO QUE EJECUTARA LAS SUBSCRIPCIONES CUANDO NOS DESCONECTEMOS
    this.cliente.onDisconnect = (frame) => {
      console.log(frame+ "of")
    }

  }

  

  escribiendo() { 
    this.cliente.publish({
      destination: '/app/escribiendo',
      body: this.user.username
    })
  }


  enviarMensaje() {
    this.mensaje.tipo = 'MENSAJE'
    this.cliente.publish({
      destination: '/app/mensaje',
      body: JSON.stringify(this.mensaje)
    })
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

  //servicios REST's 
  cargarChat(idChat : number){
    console.log(idChat)
  }



  addchat(idTipo : number){
    // let a : Amigos = this.amigos?.id!=null? this.amigos : new Amigos();
    let data : {tipo:string,titulo:string,user: Usuario,amigos:any}
    let a : any = "";
    if(idTipo===3){
      data = {tipo:'g',titulo:'Crear grupo', user:this.user, amigos : a}
    }else if(idTipo===2){
      data = {tipo:'p',titulo:'Crear chat con un amigo',user:this.user, amigos : a}
    }else if(idTipo===1){
      data = {tipo:'p',titulo:'Crear tu chat privado',user:this.user, amigos : a}
    }
    // console.log(data!)
    const dialog = this.dialog.open(ChatEdicionDialogComponent,{
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      autoFocus: false,
      // disableClose: true,
      data: data!
    })
    dialog.afterClosed().subscribe((data:ChatDTO)=>{
      console.log(data)
      if(data!=undefined){
        console.log(data)
        this.cliente.publish({
          destination: '/app/add/chat',
          body: JSON.stringify(data)
        })
      }else{
        this.snackBar.open('NO CREASTE EL CHAT','AVISO',{
          duration: 2000
        })
      }
    })
  }

}


/**PONER EL CONTENEDOR DE CHATS-MSJ CON UNA ALTUTA TOTAL Y EL HIJO QUE TOME UN DETERMINADO TAMAÑO(80%) Y MODIFICAR LA SECCION DE ACCIONES
 * PARA DARLE UN EFECTO FLOTANTE 
 */