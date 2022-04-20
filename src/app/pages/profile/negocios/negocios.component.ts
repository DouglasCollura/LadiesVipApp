import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Vacio, VacioU } from '../../../../assets/script/general';
import { Geolocation } from '@capacitor/geolocation';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NegociosService } from 'src/app/services/negocios/negocios.service';

declare var google;
declare var $: any;

@Component({
    selector: 'app-negocios',
    templateUrl: './negocios.component.html',
    styleUrls: ['./negocios.component.scss'],
})
export class NegociosComponent implements OnInit {
    @ViewChild('map_canvas',{static:false}) mapElement: ElementRef;

    constructor(
        private GeoLocationService: GeoLocationService,
        private NegociosService:NegociosService
    ) { }

    ngOnInit() {
        setTimeout(() => {
            this.initMap();
        }, 1000);
        this.GeoLocationService.getCountries().then(res => {
            this.locaciones = res;
        });
     }

    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    map: any;
    locaciones: any = null;
    estados: any = null;
    ciudades: any = null;
    
    //?GESTION=================================================================================
    negocio:any={
        p1:{
            nombre:"",
            categoria:"",
            telefono:"",
            pagina:"",
            descripcion:""
        },
        p2:{
            direccion:null,
            pais:null,
            estado:null,
            ciudad:null,
            latitud:null,
            longitud:null
        }   

    }

    formData = new FormData();
    img_length=0;
    intereses_name:any=[];
    user_imagen_show:any=[];
    //?CONTROL=================================================================================
    loading:boolean=false;
    display_create:boolean=false;
    display_main:boolean=true;
    fase:number = 1;
    ctrl_servicios: any = [];
    servicios_name:any=[];
    //? DISPLAY==========================================================
    display_interes:boolean=false;
    display_pais:boolean=false;
    display_estado:boolean=false;
    display_ciudad:boolean=false;
    //? FILTROS==========================================================
    filtro:string="";
    pais_filtro:any=[];
    estado_filtro:any=[];
    ciudad_filtro:any=[];
    //!FUNCIONES===========================================================================================================
    //?CARGA=================================================================================
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
                this.user_imagen_show.push({img:e.target.result, id:this.img_length+1});
            }
            reader.readAsDataURL(blob);
            this.img_length+=1;

            this.formData.append("imagen"+this.img_length, blob);
            
        });
 
    }

    CargarEstados() {
        this.estados = null;
        this.ciudades = null;
        this.negocio.p2.estado = null;
        this.negocio.p2.ciudad = null;
        this.loading = true;
        this.GeoLocationService.getStates(this.negocio.p2.pais).then(res => {
            this.estados = res;
            this.loading = false;
        });
    }

    CargarCiudad() {
        this.ciudades = null;
        this.negocio.p2.ciudad = null;
        this.loading = true;
        this.GeoLocationService.getCities(this.negocio.p2.estado).then(res => {
            this.ciudades = res;
            this.loading = false;
        });
    }

    //?GESTION=================================================================================
    filtrarSelect(id:any){
        var res = this.ctrl_servicios.filter(res => res == id);
        return res.length > 0 ? true:false;
    }

    selectServicio(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_servicios.push(id);
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_servicios.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
                
            });

        }
        console.log(this.ctrl_servicios)
    }

    async initMap() {
        const coordinates = await Geolocation.getCurrentPosition();
        var longitude =coordinates.coords.longitude
        var latitude = coordinates.coords.latitude
        this.negocio.p2.latitud = latitude;
        this.negocio.p2.longitud = longitude;
        var latLng = new google.maps.LatLng(latitude,longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement);
        var mapOptions = {
        center: latLng,
        zoom: 17,
        controls: {
            'myLocationButton': true,
            'myLocation': true
        },
        styles: [
            {
            "featureType": "all",
            "stylers": [
                { "visiblity": "hidden" }
            ]
            }
        ],
        disableDefaultUI: true
        };
        this.map.setOptions(mapOptions);

        let marker = new google.maps.Marker({
            position: {lat:latitude, lng:longitude},
            map: this.map,
            draggable: true,
            title: 'Ma position',
            icon: 'assets/my_location.png'
            });

        google.maps.event.addListener(this.map, 'click', (evt) =>{
            var pos = {
                lat: evt.latLng.lat(),
                lng: evt.latLng.lng()
            };
            marker.setPosition(pos);
            this.negocio.p2.latitud = pos.lat;
            this.negocio.p2.longitud = pos.lng;
            // this.map.setCenter(pos);

            console.log(evt.latLng.lat() + ' Current Lng: ' + evt.latLng.lng())
        })
        
        
    }

    SelectPais(pais:string){
        this.negocio.p2.pais = pais;
        this.CargarEstados();
        this.CerrarModal();
    }

    SelectEstado(estado:string){
        this.negocio.p2.estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
    }

    SelectCiudad(ciudad:string){
        this.negocio.p2.ciudad = ciudad;
        this.CerrarModal();
    }

    CrearNegocio(){
        this.formData.append("length", ""+this.img_length);
        this.formData.append("negocio",JSON.stringify(this.negocio))
        this.NegociosService.CrearNegocio(this.formData);
    }
    
    //?CONTROL=================================================================================
    openMCreate(){
        this.display_create = true;
        this.display_main = false;
        this.fase = 1;
    }
    closeMCreate(){
         this.display_create = false;
        this.display_main = true;       
    }

    Vacio(obj:any){
        return Vacio(obj);
    }
    VacioU(obj:any){
        return Vacio(obj);
    }

    FaseDos(){
        this.fase =2;
        this.initMap();
    }

    CerrarModal(){
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_interes = false;
            this.display_pais = false;
            this.display_estado = false;
            this.display_ciudad = false;
        }, 450)
        this.filtro = "";
    }

    filtrar(){

        if(this.display_pais){
            this.pais_filtro = [];
            this.locaciones.forEach((arrayItem:any)=> {
                if(arrayItem.country_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.pais_filtro.push(arrayItem)
                }
            });
        }else if(this.display_estado){
            this.estado_filtro = [];
            this.estados.forEach((arrayItem:any)=> {
                if(arrayItem.state_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.estado_filtro.push(arrayItem)
                }
            });
        }else{
            this.ciudad_filtro = [];
            this.ciudades.forEach((arrayItem:any)=> {
                if(arrayItem.city_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.ciudad_filtro.push(arrayItem)
                }
            });
        }


    }
}
