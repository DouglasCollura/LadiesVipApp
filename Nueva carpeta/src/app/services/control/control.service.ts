import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ControlService {

    constructor() { }

    public signupsms={
        code_phone:null,
        telefono:null,
        tipo:null
    }
}
