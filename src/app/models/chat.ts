import { Mensaje } from "./mensaje";
import { TipoChat } from "./tipoChat";

export class Chat {
    idChat: any;
    nombre:  string | undefined;
    tipoChat : TipoChat = new TipoChat();
    fechaCreacion: string | undefined;
    listaMensajes : Mensaje[] = []; 
    notificacionEscritura?: string | undefined;
    notificacionLectura?: boolean | undefined
}
