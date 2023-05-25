import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, tap } from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  ngOnInit(): void {

  }





  // ngOnInit(): void {
  //   // this.promesa("https://api.escuelajs.co/api/v1/products").then(data => {
  //   //   console.log(data)
  //   // })


  

  //   this.observer("https://api.escuelajs.co/api/v1/products").subscribe({
  //     next: data => console.log(data.response),
  //     error: e => console.log(e)
  //   })
    
  //   this.observerTwo("https://api.escuelajs.co/api/v1/products").subscribe({
  //     next: data => { console.log(data) }
  //   })
  //   this.promesa("https://api.escuelajs.co/api/v1/products?offset=1&limit=10").then(data => {
  //     console.log(data)
  //   })
  //   console.log("o")
  // }



  // promesa = (url: string): Promise<any> => {
  //   return new Promise((resolve, reject) => {
  //     fetch(url)//tecnica ajax aplicada
  //       .then(data => {
  //         // console.log(data)
  //         return data.json()
  //       }).then(data => {
  //         // console.log(data)
  //         if (data.statusCode !== 200) {
  //           resolve(data)
  //         }
  //         reject(data);
  //       })

  //   })
  // }

  // observer = (url: string): Observable<any> => {
  //   return new Observable(observador => {
  //     ajax.get(url)//es un obserbable
  //       .subscribe({
  //         next: (data) => {
  //           //  console.log(data)
  //           observador.next(data)
  //           observador.complete();
  //         },
  //         error: e => {
  //           observador.error(e)
  //         }
  //       })
  //   })
  // }


  // observerTwo = (url: string): Observable<any> => {
  //   return ajax.get(url)//es un observable y ajax.get("...") internamente ya tiene un observer.next(response); asi que solo nos subcriiriamos al metodo
  //   // this.observerTwo("...").subcribe({ next: data => {...}})
  // }

  // //su otra version pero para hacer una logica interna con un new Observable(...) $instancia
  // observerTwo2 = (url: string): Observable<any> => {
  //   return new Observable(observer => {
  //     ajax.get(url).subscribe({
  //       next: response => {
  //         observer.next(response);
  //         observer.complete();
  //       },
  //       error: e => {
  //         observer.error(e);
  //       }
  //     });
  //   });
  // };




}
