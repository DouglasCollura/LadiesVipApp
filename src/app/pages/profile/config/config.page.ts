import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { NavController, Platform } from "@ionic/angular";
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'app-config',
    templateUrl: './config.page.html',
    styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

    constructor(
        private AuthService: AuthService,
        private router:Router,
        private splashScreenStateService: SplashScreenStateService,
        public navCtrl: NavController, 
        public platform: Platform,
        private UserService:UserService
    ) { 
        this.platform.backButton.subscribeWithPriority(10, () => {
            console.log('Handler was called!');
        });
    }

    ngOnInit() {
    }

    alert:boolean=false;

    GoNegocio(){
        if(this.UserService.getPremium()){
            this.router.navigateByUrl('home/config/negocios')
        }else{
            this.alert = true;
        }
    }

    signOut():void{
        this.AuthService.logOut().then(() => {
            localStorage.clear();
            this.splashScreenStateService.start();
            location.href='/'
        })
    }

}
