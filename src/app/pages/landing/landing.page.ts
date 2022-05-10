import { Component, OnInit } from '@angular/core';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { StatusBar, StatusBarAnimation, Style } from '@capacitor/status-bar';
import { Router } from '@angular/router';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { HttpClient } from '@angular/common/http';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
    username=null;
    constructor(
        private splashScreenStateService: SplashScreenStateService,
        private router: Router,
        private http:HttpClient,
        private platform:Platform,
        private translate: TranslateService 
    ) {
        StatusBar.setOverlaysWebView({ overlay: true});
        StatusBar.hide({ animation: StatusBarAnimation.Slide}); 
        translate.setDefaultLang('es');
        translate.use('es');
     }

     

    ngOnInit() {
        this.splashScreenStateService.stop();
        if(localStorage.getItem('token')){
            location.href = '/home';
        }
    }

    async signInGoogle() {
        this.user = await GoogleAuth.signIn()
        console.log(this.user)
    }


    token=null;
    user=null;


      async logoutGoogle(){
        await GoogleAuth.signOut();
        this.user =''
      }



    //!DATA===========================================================================================================
    //?CARGA=================================================================================


    //?GESTION=================================================================================
    
    
    //?CONTROL=================================================================================
    //!FUNCION===========================================================================================================

    //?CARGA=================================================================================


    //?GESTION=================================================================================
    
    
    //?CONTROL=================================================================================
}
