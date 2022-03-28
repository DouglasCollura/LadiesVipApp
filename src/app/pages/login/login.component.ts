import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// ! SERVICIOS ============================================
import { AuthService } from 'src/app/services/auth/auth.service';
import { GoogleService } from 'src/app/services/google/google.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
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
                                    sessionStorage.setItem('usuario', JSON.stringify(login.data));
                                    sessionStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                    sessionStorage.setItem('token', login.access_token);
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
                                    sessionStorage.setItem('usuario', JSON.stringify(login.data));
                                    sessionStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                    sessionStorage.setItem('token', login.access_token);
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

    LoginSms(event:any){
        sessionStorage.setItem('usuario', JSON.stringify(event.data));
        sessionStorage.setItem('token', event.access_token);
        location.href = '/home';
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
                                sessionStorage.setItem('usuario', JSON.stringify(login.data));
                                sessionStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                sessionStorage.setItem('token', login.access_token);
                                this.AuthService.ValUser().then(res=>{
                                    if(res.length != 0){
                                        location.href = '/admin/main';
                                    }else{
                                        location.href = '/home';
                                    }
                                })
                            })
                            ///erro de credenciales
                            .catch(err => {
                                if (err.status == 401) {
                                    this.error = 2;
                                }
                            })
                    }
                    //error de email incorrecto
                    if (email.error) {
                        this.error = 1;
                    }
                    this.loading=false;
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
            !/^\w+([\.-]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail)\.(?:|com|es)+$/.test(this.usuario.datos.correo)
        ) {
            this.habLogin = false;
        } else {
            this.habLogin = true;
        }
    }
    

}
