import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
declare var $: any;


@Component({
    selector: 'app-anuncio',
    templateUrl: './anuncio.component.html',
    styleUrls: ['./anuncio.component.scss'],
})
export class AnuncioComponent implements OnInit {

    constructor(
        private AnunciosService:AnunciosService
    ) { }

    ngOnInit() { }

    //!DATA===========================================================================================================
    //?CARGA=================================================================================


    //?GESTION=================================================================================
    anuncio:any={
        intereses:"",
        descripcion:"",
        hab_notificacion:true,
        hab_chat:false,
        hab_wts:false
    };
    formData = new FormData();
    img_length=0;
    intereses_name:any=[];
    user_imagen_show:any=[];
    //?CONTROL=================================================================================
    menu:boolean=false;
    display_interes:boolean=false;
    ctrl_intereses: any = [];
    //!FUNCIONES===========================================================================================================


    //?GESTION=================================================================================


    selectIdentidad(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_intereses.push(id);
            this.intereses_name.push(event.target.textContent)
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_intereses.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
            });

            this.intereses_name.forEach(function (car: any, index: any, object: any) {
                if (car == event.target.textContent) {
                    object.splice(index, 1);
                }
            });
        }
    }

    CargarImagen() {
        Camera.getPhoto({
            quality: 40,
            source: CameraSource.Photos,
            resultType: CameraResultType.Uri
        }).then(async res=>{
            console.log(res);
            let blob = await fetch(res.webPath).then(r => r.blob());
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.user_imagen_show.push(e.target.result);
            }
            reader.readAsDataURL(blob);
            this.img_length+=1;

            this.formData.append("imagen"+this.img_length, blob);
            
        });
 
    }

    CrearAnuncio(){
        this.anuncio.intereses = this.ctrl_intereses.join();
        this.formData.append("length", ""+this.img_length);
        this.formData.append("anuncio",JSON.stringify(this.anuncio))
        this.AnunciosService.CrearAnuncio(this.formData)
    }

    //?CONTROL=================================================================================

    check(event:any){
        console.log(event)
    }

    filtrarSelect(id:any){
        var res = this.ctrl_intereses.filter(res => res == id);
        return res.length >0? true:false;
    }

    CerrarModal(){
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_interes = false;
        }, 450)
    }

    change(tipo:number){
        if(tipo == 1){
            this.anuncio.hab_notificacion = !this.anuncio.hab_notificacion;
        }

        if(tipo == 2){
            this.anuncio.hab_chat = !this.anuncio.hab_chat;
        }

        if(tipo == 3){
            this.anuncio.hab_wts = !this.anuncio.hab_wts;
        }
        console.log(this.anuncio.hab_notificacion)
    }

}
