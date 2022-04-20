import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';

// ! SERVICIOS ============================================
import { AuthService } from 'src/app/services/auth/auth.service';
import { GoogleService } from 'src/app/services/google/google.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { SmsService } from 'src/app/services/sms/sms.service';
// ! ASSETS ============================================
declare var $: any;

import { Vacio, VacioU } from '../../../assets/script/general';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    constructor(
        private router: Router,
        private AuthService: AuthService,
        private GoogleService: GoogleService,
        private FacebookService: FacebookService,
        private splashScreenStateService: SplashScreenStateService,
        private SmsService:SmsService,

    ) { }

    ngOnInit() { 
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================


    //?GESTION===================================================================================
   
    usuario: any = {
        datos: {
            correo: null,
            clave: null,
        },
        tipo: 1
    }

    //?CONTROL===================================================================================
    isOpen = false;
    habLogin = false;
    error: number = 0;
    viewPass:boolean=false;
    loading:boolean = false;
    displayRecovery:boolean=false;


    //!FUNCIONES=============================================================

    //?CARGA=============================================================


    //?GESTION============================================================

    signInWithGoogle(): void {
        this.GoogleService.GoogleAuth()
            .then((res: any) => {
                this.usuario.tipo = 2;
                this.usuario.datos.nombre = res.additionalUserInfo.profile.name;
                this.usuario.datos.correo = res.additionalUserInfo.profile.email;
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
            });
    }
    signInWithFB(): void {
        this.FacebookService.FacebookAuth()
            .then((res: any) => {
                this.usuario.tipo = 3;
                this.usuario.datos.correo = res.additionalUserInfo.profile.email;
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
            });
    }

    LoginSms(){
        // localStorage.setItem('usuario', JSON.stringify(event.data));
        // localStorage.setItem('token', event.access_token);
        // location.href = '/home';
        this.SmsService.tipo = 1;
        this.router.navigate(['/signup-sms'])

    }

    facebookUser: any;
    LogIn() {
        this.error = 0; 
        if(this.habLogin){
            this.loading = true;
            this.usuario.tipo = 1;
            //valida el email
            this.AuthService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
                .then(email => {
                    //si existe procede a iniciar sesison
                    if (email.success) {
                        this.AuthService.login(this.usuario)
                            .then(login => {
                                localStorage.setItem('usuario', JSON.stringify(login.data));
                                localStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                localStorage.setItem('token', login.access_token);
                                this.AuthService.ValUser().then(res=>{
                                    if(res.length != 0){
                                        location.href = '/admin/main';
                                    }else{
                                        this.splashScreenStateService.start();
                                        this.loading=false;
                                        location.href='/home'
                                    }
                                })
                            })
                            ///erro de credenciales
                            .catch(err => {
                                if (err.status == 401) {
                                    this.error = 2;
                                    this.loading=false;
                                }
                            })
                    }
                    //error de email incorrecto
                    if (email.error) {
                        this.error = 1;
                         this.loading=false;

                    }
                })
        }
        
    }

    
    //?CONTROL==============================================================================

    tooglePass(){
        this.viewPass = !this.viewPass;
        let pass =$("#password")

        if(pass[0].type == 'text'){
            pass[0].type = 'password'
        }else{
            pass[0].type = 'text'
        }
    }

    ValAcceso() {
        if (
            Vacio(this.usuario.datos) ||
            !/^\w+([\.-]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail)\.(?:|com|es)+$/.test(this.usuario.datos.correo) ||
            this.usuario.datos.clave.length < 8
        ) {
            this.habLogin = false;
        } else {
            this.habLogin = true;
        }
    }


}
