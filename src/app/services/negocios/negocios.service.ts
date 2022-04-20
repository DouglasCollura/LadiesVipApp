import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class NegociosService {

    constructor(
        private http: HttpClient,
    ) { }

    url = environment.serverUrl;
    token = localStorage.getItem('token')


    CrearNegocio(anuncio:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.post(`${this.url}crear-negocio`, anuncio , {headers}).toPromise()
        return send;
    }
}