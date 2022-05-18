import { Component, ElementRef, OnInit, AfterViewInit, ViewChildren, QueryList, NgZone, ViewChild  } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { environment } from 'src/environments/environment';
import { DomController, Gesture, GestureController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { NavController, Platform } from "@ionic/angular";
import { UserService } from 'src/app/services/user/user.service';
import { PagoService } from 'src/app/services/pago/pago.service';
import { FavoritoService } from 'src/app/services/favorito/favorito.service';

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
        public navCtrl: NavController, 
        public platform: Platform,
        public UserService:UserService,
        private PagoService:PagoService,
        private FavoritoService:FavoritoService
    ) {
        this.platform.backButton.subscribeWithPriority(10, () => {
            console.log('Handler was called!');
        });
        

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

    cont = 10;

    async ngOnInit() {
        this.GetAnuncios();
        this.UserService.ValidatePremium().then(res=>{
            if(res[0]){
                console.log(res[0])
                this.UserService.setPremium(true);
                this.premium = true;
            }
        })

        this.AnunciosService.GetMyAdd().then(res=>{
            if(localStorage.getItem('myadd')){
                localStorage.removeItem('myadd')
            }
            if(res[0]){
                localStorage.setItem('myadd',JSON.stringify(res[0]) )
            }
        })

        this.UserService.ValidatePack().then((res:any)=>{

            if(localStorage.getItem('pack')){
                localStorage.removeItem('pack')
            }

            if(res.anuncios){
                localStorage.setItem('pack',JSON.stringify(res) )
            }
            
        })

    }


    async ngAfterViewInit() {
        this.card.changes
        .subscribe(() => {
            let cardArray = this.card.toArray();
            this.GestionAnunciosX(cardArray)
            this.GestionAnunciosY(cardArray)
        })

        
        this.AnunciosService.add_select.subscribe(res=>{
            if(res){
                console.log(this.card)
            }
            $(this.add_select[0]).remove()
            this.card.forEach((car: any, index: any, object: any)=> {
                
                if (car.nativeElement.id == this.add_select[0].id) {
                    console.log(index)
                    object.splice(index, 1);
                    console.log(this.card)
                }
            });
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
    add_select:any;
    loggedIn: boolean = false;
    load: boolean = false;
    hoy = new Date();
    // * MODALES ================================
    ctrl_menu: number = 0;
    server = environment.server;
    premium:boolean=false;
    alert:number=0;

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
        this.anuncio.usuario.name = 'prueba';
        let actual = this.anuncios.index + 1;
    }


    showImage(urls: any) {
        return this.server + urls.split(",")[0];
    }


    cardCheck(id:any){
        $("#"+id).addClass("card_check")

        setTimeout(()=>{
            $("#"+id).css("display","none")
        },500)
    }

    cardDiss(id:any){
        $("#"+id).addClass("card_diss")

        setTimeout(()=>{
            $("#"+id).css("display","none")
        },450)
    }

    cardFav(id:any,anuncio:any){
        $("#"+id).addClass("card_fav")

        setTimeout(()=>{
            $("#"+id).css("display","none")
        },450)
        this.FavoritoService.AddFavorite(anuncio.id).then(res=>{
            console.log(res)
        })
    }

    //?CONTROL==============================================================================

    OpenAnuncio(anuncio:any, id:any){
        this.add_select = $("#"+id);
        this.AnunciosService.anuncio = anuncio;
        this.router.navigate(['home/anuncio'])
    }

    OpenAnuncioPopular(){
        if(this.premium){
        
        }else{
            this.alert=1;
        }
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
