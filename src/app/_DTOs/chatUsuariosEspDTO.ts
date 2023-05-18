import { Chat } from "../models/chat";
import { Usuario } from "../models/usuario";

export class ChatUsuarioEspDTO{
    chat : Chat = new Chat();
    listaUsuario : Usuario[]= [];
}