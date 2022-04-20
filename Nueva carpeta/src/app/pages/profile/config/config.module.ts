import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigPageRoutingModule } from './config-routing.module';

import { ConfigPage } from './config.page';
import { AnuncioComponent } from '../anuncio/anuncio.component';
import { PacksAnunciosComponent } from '../packs-anuncios/packs-anuncios.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigPageRoutingModule,
  ],
  declarations: [
    ConfigPage,
    AnuncioComponent,
    PacksAnunciosComponent
  ]
})
export class ConfigPageModule {}
