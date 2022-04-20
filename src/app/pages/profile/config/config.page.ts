import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';

@Component({
    selector: 'app-config',
    templateUrl: './config.page.html',
    styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

    constructor(
        private AuthService: AuthService,
        private router:Router,
        private splashScreenStateService: SplashScreenStateService
    ) { }

    ngOnInit() {
    }

    signOut():void{
        this.AuthService.logOut().then(() => {
            localStorage.clear();
            this.splashScreenStateService.start();
            location.href='/'
        })
    }

}
