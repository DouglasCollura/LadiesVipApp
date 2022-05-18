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
import { FavoriteComponent } from '../favorite/favorite.component';
import { ShowComponent } from '../favorite/show/show.component';

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
    AnuncioComponent,
    FavoriteComponent,
    ShowComponent
  ],
  providers: [CallNumber],
})
export class HomePageModule {}
