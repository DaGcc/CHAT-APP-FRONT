import { Usuario } from "./usuario";

export class Mensaje {
    idMensaje: any;
    usuario: Usuario = new Usuario();
    texto: string  | undefined;
    fecha: number | undefined;
    
}
