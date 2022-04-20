import { Component, OnInit } from '@angular/core';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { StatusBar, StatusBarAnimation, Style } from '@capacitor/status-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

    constructor(
        private splashScreenStateService: SplashScreenStateService,
        private router: Router,

    ) {
        StatusBar.setOverlaysWebView({ overlay: true});
        StatusBar.hide({ animation: StatusBarAnimation.Slide}); 
     }

    ngOnInit() {
        this.splashScreenStateService.stop();
        if(localStorage.getItem('token')){
            location.href = '/home';
        }
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
