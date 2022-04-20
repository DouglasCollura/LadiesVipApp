import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LandingPageModule } from './pages/landing/landing.module';
import { SplashScreenStateService } from './services/splash-screen-state.service';
import { SplashScreenStateComponent } from './pages/splash-screen-state/splash-screen-state.component';

@NgModule({
  declarations: [AppComponent,SplashScreenStateComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    HttpClientModule, 
    AppRoutingModule, 
    LandingPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the app is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [SplashScreenStateService,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
