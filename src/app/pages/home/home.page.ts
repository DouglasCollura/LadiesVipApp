import { Component, ElementRef, OnInit, AfterViewInit, ViewChildren, QueryList, NgZone, ViewChild  } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { environment } from 'src/environments/environment';
import { DomController, Gesture, GestureController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';

// ! ASSETS ============================================
declare var $: any;
declare var google;

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

    constructor(
        private splashScreenStateService: SplashScreenStateService,
        private AnunciosService: AnunciosService,
        private gestureCtrl: GestureController,
        private domCtrl: DomController,
        private router: Router,
    ) {

    }


    @ViewChildren("card", {read: ElementRef }) card: QueryList<ElementRef>;
    map: any;
    chosen:any = 0;
    marker: any;
    text:any;
    data:any;
    lat:any;
    lng:any;
    detected:any;
    changing:any = 0;
    polygons:any = [];
    quartier:any = 0;
    async ngOnInit() {
        this.GetAnuncios();

    }

  

    async ngAfterViewInit() {
        this.card.changes
        .subscribe(() => {
            let cardArray = this.card.toArray();
            this.GestionAnunciosX(cardArray)
            this.GestionAnunciosY(cardArray)
        })
    }

    GestionAnunciosX(cardArray) {
        
        for (let i = 0; i < cardArray.length; i++) {
            const card = cardArray[i];
            const gesture = this.gestureCtrl.create({
                el: card.nativeElement,
                threshold: 5,
                gestureName: 'moveX',
                disableScroll: true,
                direction:'x',
                gesturePriority:3,
                onMove: ev => {
                    const currentX = ev.currentX;
                    const currentY = ev.currentY;
                    card.nativeElement.style.transform = `
                        translateX(${ev.deltaX}px) 
                        rotate(${(currentX - ev.startX) / 12}deg)
                    `;
                },
                onEnd: ev => {
                    console.log('move end!');
                    card.nativeElement.style.transition = '0.2s ease-out';

                    if (Math.abs(ev.deltaX) >= 110) {
                        card.nativeElement.style.opacity = '0';
                        setTimeout(()=>{
                            card.nativeElement.style.display = 'none'
                        }
                        ,1000)

                    } else {
                        card.nativeElement.style.transform = `translateX(0px)`;
                    }

                }
            })
            gesture.enable(true);
        }

    }

    GestionAnunciosY(cardArray) {
        
        for (let i = 0; i < cardArray.length; i++) {
            const card = cardArray[i];
            const gesture = this.gestureCtrl.create({
                el: card.nativeElement,
                threshold: 5,
                gestureName: 'moveY',
                disableScroll: true,
                direction:'y',
                gesturePriority:2,
                onMove: ev => {

                    if(ev.deltaY > -130 && ev.deltaY < 0){
                        card.nativeElement.style.transform = `
                            translateY(${ev.deltaY}px) 
                        `;
                    }
                },
                onEnd: ev => {
                    console.log('move end!');

                    if (ev.deltaY < -100) {
                        card.nativeElement.style.opacity = '0';
                        setTimeout(()=>{
                            card.nativeElement.style.display = 'none'
                        }
                        ,800)
                    } else {
                        card.nativeElement.style.transform = `translateY(0px)`;
                    }
                    card.nativeElement.style.transition = '0.2s ease-out';
                }
            })
            gesture.enable(true);
        }

    }

    //!DATA=====================================================================
    latitude: number;
    longitude: number;
    zoom: number;
    address: string;
    private geoCoder;
    //?CARGA===================================================================================
    anuncios: any = {
        data: [],
        length: null,
        index: null
    };

    //?GESTION===================================================================================
    anuncio: any = [];

    //?CONTROL===================================================================================
    loggedIn: boolean = false;
    load: boolean = false;
    hoy = new Date();
    // * MODALES ================================
    ctrl_modal_detalles: boolean = false;
    ctrl_menu: number = 0;
    server = environment.server;
    
    //!FUNCIONES=============================================================
    //?CARGA=============================================================
    GetAnuncios() {

        this.AnunciosService.GetAnuncios().then(res => {
            this.anuncios.data = res.data;
            this.anuncios.length = res.total;
            this.anuncios.index = 0;
            this.anuncio = this.anuncios.data[0]
            this.splashScreenStateService.stop();
        });
    }

    //?GESTION============================================================

    PassAnuncio() {
        console.log('ayo')
        this.anuncio.usuario.name = 'prueba';
        let actual = this.anuncios.index + 1;
    }


    showImage(urls: any) {
        return this.server + urls.split(",")[0];
    }

    //?CONTROL==============================================================================

    OpenAnuncio(anuncio:any){
        this.AnunciosService.anuncio = anuncio;
        this.router.navigate(['home/anuncio'])
    }

    GetEdad(fecha: any) {
        var cumpleanos = new Date(fecha);
        var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
        var m = this.hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    }

    nav(menu: number) {
        this.ctrl_menu = menu;
    }


}
