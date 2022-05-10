import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { MarketComponent } from '../market/market.component';
import { MensajesComponent } from '../mensajes/mensajes.component';
import { NotifyComponent } from '../notify/notify.component';
import { ProfileComponent } from '../profile/profile/profile.component';
import { AnuncioComponent } from './anuncio/anuncio.component';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [
    
    HomePage,
    MarketComponent,
    MensajesComponent,
    NotifyComponent,
    ProfileComponent,
    AnuncioComponent
  ],
  providers: [CallNumber],
})
export class HomePageModule {}
