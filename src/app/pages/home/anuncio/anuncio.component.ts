import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { Browser } from '@capacitor/browser';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { DomController, Gesture, GestureController } from '@ionic/angular';
import {Location} from '@angular/common';
declare var $: any;

@Component({
    selector: 'app-anuncio',
    templateUrl: './anuncio.component.html',
    styleUrls: ['./anuncio.component.scss'],
})
export class AnuncioComponent implements OnInit, AfterViewInit {

    constructor(
        private AnunciosService: AnunciosService,
        private callNumber: CallNumber,
        private gestureCtrl: GestureController,
        private domCtrl: DomController,
        private location: Location
    ) { }
    
    @ViewChildren("images", {read: ElementRef }) images: QueryList<ElementRef>;

    ngOnInit() {
        this.anuncio = this.AnunciosService.anuncio;
        this.urls_image = this.anuncio.urls.split(",");
    }


    async ngAfterViewInit() {
        this.GestionAnunciosX(this.images.toArray())

        this.images.changes
        .subscribe(() => {
            let imagesArray = this.images.toArray();
            this.GestionAnunciosX(imagesArray)
        })
    }


    GestionAnunciosX(imagesArray) {
        
        for (let i = 0; i < imagesArray.length; i++) {
            const images = imagesArray[i];
            this.point_img = i;
            const gesture = this.gestureCtrl.create({
                el: images.nativeElement,
                threshold: 5,
                gestureName: 'moveX',
                disableScroll: true,
                direction:'x',
                gesturePriority:3,
                onStart: ev =>{
                    console.log(i);
                    this.point_img = i;

                    
                    console.log(this.point_img)
                    if(ev.deltaX < 0){
                        if(imagesArray[i-1]){
                            imagesArray[i-1].nativeElement.style.display = 'none';
                        }
                    }
                },
                onMove: ev => {
                    const currentX = ev.currentX;
                    const currentY = ev.currentY;
                    if(ev.deltaX < 0){
                        if(imagesArray[i-1]){
                            images.nativeElement.style.transform = `
                                translateX(${ev.deltaX}px) 
                            `;
                        }
                    }else{
                        if(imagesArray[i+1]){
                            images.nativeElement.style.transform = `
                                translateX(${ev.deltaX}px) 
                            `;
                        }
                    }
                    
                },
                onEnd: ev => {
                    console.log('move end!');
                    images.nativeElement.style.transition = '0.2s ease-out';

                    if(ev.deltaX < 0){
                        if(imagesArray[i-1]){
                            $('.point-active').removeClass("point-active").addClass("point")
                            $('#'+(i-1)).removeClass("point").addClass("point-active")
                            imagesArray[i-1].nativeElement.style.transition = '0.2s ease-out';
                            imagesArray[i-1].nativeElement.style.display = 'grid';
                            imagesArray[i-1].nativeElement.style.opacity = '1';
                            imagesArray[i-1].nativeElement.style.transform = `translateX(0px)`;

                            if (Math.abs(ev.deltaX) >= 110) {
                                images.nativeElement.style.opacity = '0';
                                setTimeout(()=>{
                                    images.nativeElement.style.display = 'none'
                                }
                                ,500)
                            } else {
                                images.nativeElement.style.transform = `translateX(0px)`;
                            }
                        }

                    }else{
                        if(imagesArray[i+1]){
                            $('.point-active').removeClass("point-active").addClass("point")
                            $('#'+(i+1)).removeClass("point").addClass("point-active")
                            if (Math.abs(ev.deltaX) >= 110) {
                                imagesArray[i+1].nativeElement.style.transition = '0.2s ease-out';
                                images.nativeElement.style.opacity = '0';
                                imagesArray[i+1].nativeElement.style.display = 'grid';
                                imagesArray[i+1].nativeElement.style.opacity = '1';
                                imagesArray[i+1].nativeElement.style.transform = `translateX(0px)`;
                                setTimeout(()=>{
                                    images.nativeElement.style.display = 'none'
                                }
                                ,500)
    
                            } else {
                                images.nativeElement.style.transform = `translateX(0px)`;
                            }
                        }
                    }


                }
            })
            gesture.enable(true);
        }

    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    anuncio:any;
    urls_image:any=[];

    //?GESTION===================================================================================
 
    //?CONTROL===================================================================================
    url = environment.server;
    point_img = 0;

    GetUrls(urls:any){
        return urls.split(",");
    }

    cardCheck(){
        $(".temp-anuncio").addClass("card_check")
        this.AnunciosService.add_select.emit(true);

        setTimeout(()=>{
            $(".temp-anuncio").css("display","none")
            this.location.back();
        },450)
    }

    cardDiss(){
        $(".temp-anuncio").addClass("card_diss")
        this.AnunciosService.add_select.emit(true);

        setTimeout(()=>{
            $(".temp-anuncio").css("display","none")
            this.location.back();
        },450)
    }

    cardFav(){
        $(".temp-anuncio").addClass("card_fav")
        this.AnunciosService.add_select.emit(true);

        setTimeout(()=>{
            $(".temp-anuncio").css("display","none")
            this.location.back();
        },450)
    }

    GoToBrowser(){

        Browser.open({ url: 'https://api.whatsapp.com/send?phone='+this.anuncio.usuario.code_phone+this.anuncio.usuario.telefono });
    }

    GoToCall(){
        this.callNumber.callNumber(this.anuncio.usuario.code_phone+this.anuncio.usuario.telefono, true);
    }


}
