import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UtilService {

  sideBarCambio  = new Subject<void>();

  constructor() { }
}
