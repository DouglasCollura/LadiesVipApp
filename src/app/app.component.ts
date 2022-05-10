import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {

    constructor(
        private StatusBar:StatusBar,
        
    ) {
        
        this.StatusBar.overlaysWebView(false);
        this.StatusBar.backgroundColorByHexString('#fcfcfc');
        this.StatusBar.styleDefault();

       
    }

}
