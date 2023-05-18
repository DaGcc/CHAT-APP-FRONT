import { Chat } from "./chat";
import { Usuario } from "./usuario";

export class Mensaje {
    idMensaje: any;
    chat : Chat | undefined;
    usuario: Usuario | undefined;
    texto: string  | undefined;
    tipo : string  | undefined;
    fecha: Date | undefined;
}
