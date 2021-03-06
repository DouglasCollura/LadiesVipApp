import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MarketService } from 'src/app/services/market/market.service';
import { DomController, Gesture, GestureController } from '@ionic/angular';
declare var $: any;

@Component({
    selector: 'app-market',
    templateUrl: './market.component.html',
    styleUrls: ['./market.component.scss'],
})
export class MarketComponent implements OnInit, AfterViewInit {

    constructor(
        private MarketService:MarketService,
        private gestureCtrl: GestureController,

    ) { }


    @ViewChildren("images", {read: ElementRef }) images: QueryList<ElementRef>;

    ngOnInit() { }

    async ngAfterViewInit() {
        this.GestionAnunciosX(this.images.toArray())

        this.images.changes
        .subscribe(() => {
            let imagesArray = this.images.toArray();
            this.GestionAnunciosX(imagesArray)
        })
    }

    GestionAnunciosX(imagesArray) {
        console.log(imagesArray.length)
        
        for (let i = 0; i < imagesArray.length; i++) {
            const images = imagesArray[i];
            console.log(this.point_img)
            const gesture = this.gestureCtrl.create({
                el: images.nativeElement,
                threshold: 5,
                gestureName: 'moveX',
                disableScroll: true,
                direction:'x',
                gesturePriority:3,
                onStart: ev =>{
                    this.point_img = i;

                    
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


    //!DATA===========================================================================================================
    //?CARGA=================================================================================


    //?GESTION=================================================================================
    current:number= 0;
    last:number=0;
    data:any;
    urls_img:any;
    data_show:any=null;

    //?CONTROL=================================================================================
    display_market: boolean = true ;
    display_res: boolean = false;
    display_show:boolean=false;
    
    url = environment.server;
    point_img = 0;

    //!FUNCIONES===========================================================================================================

    //?GESTION=================================================================================
    
    SelectCat(id:number){
        this.MarketService.SearchNegocio(id).then(res=>{
            console.log(res)
            this.current = res.current_page;
            this.last = res.last_page;
            this.data = res.data;
            this.display_market=false;
            this.display_res=true;
        })
    }
    
    OpenShow(data:any){
        this.data_show=data;
        this.display_res= false;
        this.display_show= true;
        this.urls_img = data.images.split(",");
        this.point_img = this.urls_img.length-1;
        console.log(data)
    }

    //?CONTROL=================================================================================

    GetImg(img:any){
        let urls_img = img.split(",");
        return urls_img[0]
    }

    CloseRes(){
        this.current = 0;
        this.last = 0;
        this.data = null;
        this.display_market= true;
        this.display_res=false;
    }

    CloseShow(){
        this.display_res= true;
        this.display_show=false;
    }

}
