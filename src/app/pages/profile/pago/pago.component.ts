import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import {first} from 'rxjs/operators';
import { loadScript } from "@paypal/paypal-js";
import { PagoService } from 'src/app/services/pago/pago.service';
import { Router } from '@angular/router';



@Component({
    selector: 'app-pago',
    templateUrl: './pago.component.html',
    styleUrls: ['./pago.component.scss'],
})
export class PagoComponent implements OnInit, AfterViewInit {

    private stripe:Stripe;

    constructor(
        private http:HttpClient,
        private PagoService:PagoService,
        private route:Router
        
    ) {

     }

    card:any;

    async ngOnInit() {
        console.log(this.PagoService.titulo[this.PagoService.tipo])
        this.titulo = this.PagoService.titulo[this.PagoService.tipo];
        this.tipo = this.PagoService.tipo;
        this.PagoService.change.subscribe(res=>{
            this.titulo = res.tipo;
            this.tipo = res.tipo;
            console.log("asdsd")
        })

    }

    async ngAfterViewInit() {
        this.stripe = await loadStripe("pk_test_51KcEeCGTu8C9ATXJ27WhTKVVnV9hQ9fC9F4uFVtL3ni61XdwHDBwZ9UzGk5utqZPjhC9wfpGY0j3NyYjbbXyorO6001gyUwCa5")
        const elements = this.stripe.elements(); 
        this.card = elements.create('card');
        this.card.mount('#card')
        console.log( "card" )
        console.log(this.card)

        loadScript({ "client-id": 'AfMbL49xhYNp98gwCLrZDpChIvolqowH9K4AIUVjbSr4F9Rnpw0Jr3P4fQvM9MmVIqkDuN9ILllD3ZDC', currency: "EUR" })
        .then((paypal) => {

            console.log("paypal ")
            paypal
            .Buttons()
            .render("#paypal")
            .catch((error) => {
                console.error("failed to render the PayPal Buttons", error);
            });
            // start to use the PayPal JS SDK script

        })
        .catch((err) => {

            console.error("failed to load the PayPal JS SDK script", err);

        });
    }
    

    async go(){
        console.log("res")

        const ownerInfo = {
            owner: {name: 'codexmaker'},
            amount: 1,
            currency:'eur'
        }

        this.stripe.createToken(this.card).then(res=>{
            console.log("token")
            console.log(res.token)
            
        });
        // const res = await this.stripe.createSource(this.card, ownerInfo).then(res=>{
        //     console.log(res.source)
        //     this.stripe.redirectToCheckout


        // })

    }
   

    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    titulo="";
    
    //?GESTION=================================================================================
    tipo:number=0;


    //?CONTROL=================================================================================
    fase_pago=0;
    metodo_pago=0;
   
    //!FUNCIONES===========================================================================================================
   
    //?CARGA=================================================================================


    //?FUNCION=================================================================================



    //?CONTROL=================================================================================
    SelectMetodo(metodo:number){
        this.metodo_pago = metodo;
        this.fase_pago = 1;
    }

    Return(){
        this.fase_pago = 0;
        this.route.navigateByUrl('home/config/packs_anuncios')

    }
}
