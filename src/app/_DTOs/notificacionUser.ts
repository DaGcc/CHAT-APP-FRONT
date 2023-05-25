import { Chat } from "../models/chat";
import { Usuario } from "../models/usuario"

export class NotificacionUser{
    usuario: Usuario = new Usuario();
    chat : Chat = new Chat();
    tipo: string | undefined;
}