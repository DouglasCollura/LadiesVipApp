import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ConfigPageRoutingModule } from './config-routing.module';

import { ConfigPage } from './config.page';
import { AnuncioComponent } from '../anuncio/anuncio.component';
import { PacksAnunciosComponent } from '../packs-anuncios/packs-anuncios.component';
import { InformacionPersonalComponent } from '../informacion-personal/informacion-personal.component';
import { NegociosComponent } from '../negocios/negocios.component';
import { CuentaAccesoComponent } from '../cuenta-acceso/cuenta-acceso.component';
import { PagoComponent } from '../pago/pago.component';
import { HelpComponent } from '../help/help.component';


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
    PacksAnunciosComponent,
    InformacionPersonalComponent,
    NegociosComponent,
    CuentaAccesoComponent,
    PagoComponent,
    HelpComponent
  ],
})
export class ConfigPageModule {}
