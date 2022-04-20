import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AnunciosService {

    constructor(
        private http: HttpClient,
    ) { }

    // url = environment.serverUrl;
    url = environment.serverUrl;
    token = localStorage.getItem('token');


    GetAnuncio(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}anuncios-user?page=1`, {headers}).toPromise()
        return send;
    }

    CrearAnuncio(anuncio:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.post(`${this.url}send-anuncios`, anuncio , {headers}).toPromise()
        return send;
    }
}
