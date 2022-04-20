import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';

// ! SERVICIOS ============================================
import { AuthService } from 'src/app/services/auth/auth.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { GoogleService } from 'src/app/services/google/google.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { ControlService } from 'src/app/services/control/control.service';
// ! ASSETS ============================================
declare var $: any;
import { Vacio, VacioU, SoloLetra, SoloNumero } from '../../../assets/script/general';
import { SmsService } from 'src/app/services/sms/sms.service';
import { RecoverypassService } from '../recoverypass/recoverypass.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

    constructor(
        private GeoLocationService: GeoLocationService,
        private router: Router,
        private AuthService: AuthService,
        private FacebookService: FacebookService,
        private GoogleService: GoogleService,
        private splashScreenStateService: SplashScreenStateService,
        private SmsService:SmsService,
        private ControlService:ControlService,
        private RecoverypassService:RecoverypassService
        
    ) { 

    }

    ngOnInit() {
        this.GeoLocationService.getCountries().then(res => {
            this.locaciones = res;
        });
        console.log(this.SmsService.SignUpType.subscribe(res=>{
            console.log("SIGNUP TYPE: "+ res.signup_type)
            if(res.signup_type == 4){
                    this.usuario.datos.code_phone = this.SmsService.sms.code_phone;
                    this.usuario.datos.telefono = this.SmsService.sms.telefono;
                    this.usuario.tipo = 4;
                    this.fase = 2;
                }
        }))


     }


    //!DATA===========================================================================================================
    //?CARGA=================================================================================

    locaciones: any = null;
    estados: any = null;
    ciudades: any = null;


    //?GESTION=================================================================================
    loggedIn: boolean = false;

    usuario: any = {
        tipo: null,
        datos: {
            nombre: "",
            correo: "",
            code_phone: '+',
            telefono: "",
            clave: ""
        },
        fecha_nac: "",
        locacion: {
            pais: null,
            estado: null,
            ciudad: null
        },
        geo:{
            long:null,
            lat:null
        },
        identidad: null,
        servicio: null,
        interes_identidad: null,
        interes_servicio: null
    };

    code_1:string="";
    code_2:string="";
    code_3:string="";
    code_4:string="";
    code_5:string="";
    re_code:boolean=false;

    img_user: any = null;
    rep_clave:any = null;
    ctrl_identidad: any = [];
    ctrl_servicios: any = [];
    user_imagen_show: any;
    country_short_name:string ='';

    //?CONTROL=================================================================================
    fase:number=0;
    error:number=0;
    viewPass:boolean=false;
    viewRePass: boolean = false;
    pass:boolean=false;
    edad:number=0;
    loading:boolean=false;
    canSignUp: boolean = false;

    //? FILTROS==========================================================
    tipo_filtro:string="";
    filtro:string="";
    telf_filtro:any=[];
    pais_filtro:any=[];
    estado_filtro:any=[];
    ciudad_filtro:any=[];

    //* MODALES========================================================
    display_telf:boolean=false;
    display_pais:boolean=false;
    display_estado:boolean=false;
    display_ciudad:boolean=false;

    //!FUNCION===========================================================================================================

    //?CARGA=================================================================================
    CargarEstados() {
        this.estados = null;
        this.ciudades = null;
        this.usuario.locacion.estado = null;
        this.usuario.locacion.ciudad = null;
        this.loading = true;
        this.GeoLocationService.getStates(this.usuario.locacion.pais).then(res => {
            this.estados = res;
            this.loading = false;
        });
    }

    CargarCiudad() {
        this.ciudades = null;
        this.usuario.locacion.ciudad = null;
        console.log(this.usuario.locacion.estado);
        this.loading = true;
        this.GeoLocationService.getCities(this.usuario.locacion.estado).then(res => {
            this.ciudades = res;
            this.loading = false;
            if(this.ciudades.length == 0){
                this.pass = true;
            }
        });
    }

    //?GESTION=================================================================================
    
    //!================== REGISTRO Y LOGUEO DE CUENTAS ==============================
    
    //!registro con facebook
    signUpFacebook() {
        //inicia sesion facebook
        this.FacebookService.FacebookAuth()
            .then((res: any) => {
                ///comprueba si el facebook trae correro
                if (res.additionalUserInfo.profile.email != null || res.additionalUserInfo.profile.email != undefined) {
                    this.usuario.tipo = 3;
                    this.usuario.datos.nombre = res.additionalUserInfo.profile.name;
                    this.usuario.datos.correo = res.additionalUserInfo.profile.email;
                    ///valida si el email que entra para registro existe
                    this.AuthService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
                        .then((valid) => {
                            //si no existe puedes registrate
                            if (valid.error) {
                                this.fase = 1;
                            }
                            //si existe anuncia con alerta
                            if (valid.success) {
                                this.signInWithFB()
                            }
                        });
                }
            })
    }

    //!registro con google
    signUpGoogle() {
        //inicia sesion facebook
        this.GoogleService.GoogleAuth()
            .then((res: any) => {
                console.log(res)
                //comprueba si el facebook trae correro
                if (res.additionalUserInfo.profile.email != null || res.additionalUserInfo.profile.email != undefined) {
                    this.usuario.tipo = 2;
                    this.usuario.datos.nombre = res.additionalUserInfo.profile.name;
                    this.usuario.datos.correo = res.additionalUserInfo.profile.email;
                    ///valida si el email que entra para registro existe
                    this.AuthService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
                        .then((valid) => {
                            //si no existe puedes registrate
                            if (valid.error) {
                                this.fase = 1;
                            }
                            //si existe anuncia con alerta
                            if (valid.success) {
                                this.signInWithGoogle()
                            }
                        });
                }
            })
    }

    SignUpSms(){
        this.SmsService.tipo = 0;
        this.router.navigate(['/signup-sms'])
    }

    //!inicio de sesion con google en caso de estar registrado
    signInWithGoogle(): void {
        //valida que el email esté registrado
        this.AuthService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
            .then(email => {
                //si existe procede a iniciar sesison
                if (email.success) {
                    this.AuthService.loginSocial(this.usuario)
                        .then(login => {
                            localStorage.setItem('usuario', JSON.stringify(login.data));
                            localStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                            localStorage.setItem('token', login.access_token);
                            location.href = '/home';
                        })
                }
                //error si no es un usuario facebook o no registrado
                if (email.error) {
                    alert('error, compruebe su email o compruebe otro metodo de logueo')
                }
            })

    }

    //!inicio de sesion con facebook en caso de estar registrado
    signInWithFB(): void {
        //valida que el email esté registrado
        this.AuthService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
            .then(email => {
                //si existe procede a iniciar sesison
                if (email.success) {
                    this.AuthService.loginSocial(this.usuario)
                        .then(login => {
                            localStorage.setItem('usuario', JSON.stringify(login.data));
                            localStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                            localStorage.setItem('token', login.access_token);
                            location.href = '/home';
                        })
                }
                //error si no es un usuario facebook o no registrado
                if (email.error) {
                    alert('error, compruebe su email o compruebe otro metodo de logueo')
                }
            })
    }
    
    CrearCuenta() {
        this.error =0;
        this.re_code = false;
        this.SmsService.sms.code_phone = this.usuario.datos.code_phone;
        this.SmsService.sms.telefono = this.usuario.datos.telefono;
        if(this.canSignUp){
            this.loading = true;
            this.usuario.tipo = 1;
            this.AuthService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
            .then(valid => {
                //si no existe puedes registrate
                if (valid.error) {
                    this.error=0;
                    this.EnviarCodigo()
                }
                //si existe anuncia con alerta
                if (valid.success) {
                    this.error=2;
                }
            })
        }else{
            if(
                this.usuario.datos.nombre == "" || 
                this.usuario.datos.clave == "" || 
                this.usuario.datos.correo == "" || 
                this.usuario.datos.code_phone == '+' || 
                this.usuario.datos.telefono == "" ||
                !/^\w+([\.-]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail)\.(?:|com|es)+$/.test(this.usuario.datos.correo)
            ){
                this.error = 1;
                this.canSignUp = false;
            }
            else if(this.usuario.datos.clave.length < 8){
                this.error = 3;
                this.canSignUp = false;
            }
            else if(this.rep_clave != this.usuario.datos.clave){
                this.error = 4;
                this.canSignUp = false;
            }
        }

    }

    EnviarCodigo(){
        this.code_1="";
        this.code_2="";
        this.code_3="";
        this.code_4="";
        this.code_5="";

        this.AuthService.SendEmail({email:this.usuario.datos.correo})
        .then( res=>{
            console.log(res)
            if(res.success){
                this.loading = false;
                setTimeout(()=>{
                    this.re_code =true;
                }, 120000);
                this.fase = 1;
            }else{
                this.error = 5;
                this.loading = false;
            }
        })
    }

    VerificarCodigoSMS() {
        this.RecoverypassService.usuario.correo = this.usuario.datos.correo;
        this.RecoverypassService.usuario.codigo = this.code_1 + this.code_2 + this.code_3 + this.code_4 + this.code_5;
        this.loading = true;
        this.RecoverypassService.ValCode(1).then(res=>{
            console.log(res);
            if(!res.error){
                this.fase = 2;
                this.loading = false;
            }else{
                this.error = 1;
                this.loading = false;
            }
        });
    }
    
    SelectCodeTlf(code_phone: string, country_short_name: string) {
        this.usuario.datos.code_phone = code_phone;
        this.country_short_name = country_short_name;
        this.CerrarModal();
        this.telf_filtro = [];
    }

    SelectPais(pais:string){
        this.usuario.locacion.pais = pais;
        this.CargarEstados();
        this.CerrarModal();
        this.pass = false;
    }

    SelectEstado(estado:string){
        this.usuario.locacion.estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
        this.pass = false;

    }

    SelectCiudad(ciudad:string){
        this.usuario.locacion.ciudad = ciudad;
        this.CerrarModal();
        this.pass = true;
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
                this.user_imagen_show = e.target.result;
            }
            reader.readAsDataURL(blob);

            let formData = new FormData();
            formData.append("imagen", blob);
            this.img_user = formData;
        });
        if(VacioU(this.img_user)){
            this.pass=true;
        }
 
    }

    ActivarGeo() {
        navigator.geolocation.getCurrentPosition((pos: any) => {
            var crd = pos.coords;

            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
            this.usuario.geo.lat = crd.latitude;
            this.usuario.geo.long = crd.longitude;
            this.SignUp();
        }, (err: any) => {
            console.log(`ERROR(${err.code}): ${err.message}`);
        });

    }

    ///REGISTRO DE USUARIO
    SignUp() {
        this.fase=10;
        if (this.usuario.tipo == 1) {
            this.AuthService.signUp(this.usuario)
            .then(res => {
                if (res.success) {
                    //guarda imagen de usuario
                    this.AuthService.UpImage(this.img_user, res.data.id)
                    .then(img => {
                        // inicia sesion y redirige
                        this.AuthService.login(this.usuario)
                        .then(login => {
                            localStorage.setItem('usuario', JSON.stringify(login.data));
                            localStorage.setItem('ruta_img', JSON.stringify(img));
                            localStorage.setItem('token', login.access_token);
                            //redirige
                            this.splashScreenStateService.start();
                            location.href = '/home';
                        })
                    })
                }
            })
        }
        if (this.usuario.tipo == 2 || this.usuario.tipo == 3 || this.usuario.tipo == 4) {
            //comienza el registro con redes sociales
            this.AuthService.signUpSocial(this.usuario)
                .then(res => {
                    console.log(res)
                    if (res.success) {
                        //guarda imagen de usuario
                        this.AuthService.UpImage(this.img_user, res.data.id)
                            .then(img => {
                                // inicia sesion y redirige
                                this.AuthService.loginSocial(this.usuario)
                                    .then(login => {
                                        localStorage.setItem('usuario', JSON.stringify(login.data));
                                        localStorage.setItem('ruta_img', JSON.stringify(img));
                                        localStorage.setItem('token', login.access_token);
                                        this.splashScreenStateService.start();
                                        //redirige
                                        location.href = '/home';
                                    })
                            })
                    }
                })
        }

    }


    //?CONTROL=================================================================================

    filtrar(){

        if(this.display_telf){
            this.telf_filtro = [];
            this.locaciones.forEach((arrayItem:any)=> {
                if(arrayItem.country_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.telf_filtro.push(arrayItem)
                }
    
                if(String(arrayItem.country_phone_code).indexOf(this.filtro)> -1){
                    this.telf_filtro.push(arrayItem)
                }
            });
        }else if(this.display_pais){
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
        }


    }

    CerrarModal(){
        $(".bg-card").removeClass("fadeIn")
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_telf = false;
            this.display_pais = false;
            this.display_estado = false;
            this.display_ciudad = false;
        }, 450);
        this.filtro = "";
    }

    
    selectIdentidad(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_identidad.push(id);
            this.pass = true;
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_identidad.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
            });
            if(this.ctrl_identidad.length == 0 && this.ctrl_servicios.length == 0){
                this.pass = false;
            }
        }
        console.log(this.ctrl_identidad)
    }

    selectServicio(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_servicios.push(id);
            this.pass = true;
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_servicios.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
            });

            if(this.ctrl_identidad.length == 0 && this.ctrl_servicios.length == 0){
                this.pass = false;
            }
        }
    }

    SelectImg() {
        $("#img").trigger("click");
    }

    mostrar($event: any) {
        $event.target.selectedOptions[0].text = '+' + this.usuario.datos.code_phone;
    }

    CanSignUp() {
        this.error = 0;

        if(this.usuario.datos.clave.length < 8){
            this.canSignUp = false;
        }else
        if(this.rep_clave != this.usuario.datos.clave){
            this.canSignUp = false;
        }else if(
            this.usuario.datos.nombre == "" || 
            this.usuario.datos.clave == "" || 
            this.usuario.datos.correo == "" || 
            this.usuario.datos.code_phone == '+' || 
            this.usuario.datos.telefono == "" || 
            !/^\w+([\.-]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail)\.(?:|com|es)+$/.test(this.usuario.datos.correo)
        ){
            this.canSignUp = false;
        }else{
            this.canSignUp = true;
        }
    }

    CtrlForm() {
        if (this.fase == 3) {
            this.error = 0;
            if (VacioU(this.usuario.fecha_nac)) {
                this.error = 1;
                return;
            }

            var hoy = new Date();
            var cumpleanos = new Date(this.usuario.fecha_nac);
            var edad = hoy.getFullYear() - cumpleanos.getFullYear();
            var m = hoy.getMonth() - cumpleanos.getMonth();

            if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
                edad--;
            }
            if(edad < 18){
                this.edad = edad;
                this.error = 2;
            }else{
                this.pass = false;
                this.fase = 4;
            }
        }
        else if (this.fase == 4) {
            this.error =0;

            if (Vacio(this.usuario.locacion)) {
                if(this.ciudades.length != 0){
                    this.error =1;
                    return;
                }
            }
            this.pass = false;
            this.fase = 5;
        }
        
        else if (this.fase == 5) {
            this.error = 0;
            if (this.ctrl_identidad.length == 0 && this.ctrl_servicios.length == 0) {
                this.error = 1;
                return;
            }

            this.usuario.identidad = this.ctrl_identidad.join();
            this.ctrl_identidad = [];
            this.fase = 6;
            this.error = 0;
            this.pass = false;
        }

        else if (this.fase == 6) {
            if (this.user_imagen_show) {
                this.fase = 7;
                this.pass = false;
            } else {
                this.error = 1;
                return;
            }
        }
        
        else if (this.fase == 7) {
            this.error = 0;
            this.pass = false;
            if (this.ctrl_identidad.length == 0 && this.ctrl_servicios.length == 0) {
                this.error = 1;
                return;
            }
            this.usuario.interes_identidad = this.ctrl_identidad.join();
            this.usuario.interes_servicio = this.ctrl_servicios.join();
            this.ctrl_identidad = [];
            this.ctrl_servicios = [];
            this.fase = 8;
            this.error = 0;
            this.pass = false;
        }

        else {
            this.error = 0;
            if (this.ctrl_servicios.length == 0) {
                this.error = 1;
                return;
            }

            this.usuario.servicio = this.ctrl_servicios.join();
            this.ctrl_servicios = [];
            this.fase = 9;
            this.error = 0;
            this.pass = false;
        }

    }

    SoloLetra(evt: any) {
        return SoloLetra(evt)
    }

    SoloNumero(evt: any) {
        return SoloNumero(evt)
    }

    tooglePass(tipo:boolean){
        if(tipo){
            this.viewPass = !this.viewPass;
        }else{
            this.viewRePass = !this.viewRePass;
        }
    }

    VacioU(obj:any){
        return VacioU(obj)
    }

    nextInput(e:any, next:string){
        if( e.target.value.length == e.target.getAttribute('maxlength')){
            $(`input[name='${next}']`).focus()
        }
    }
    
}
