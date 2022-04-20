import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnuncioComponent } from '../anuncio/anuncio.component';
import { CuentaAccesoComponent } from '../cuenta-acceso/cuenta-acceso.component';
import { InformacionPersonalComponent } from '../informacion-personal/informacion-personal.component';
import { NegociosComponent } from '../negocios/negocios.component';
import { PacksAnunciosComponent } from '../packs-anuncios/packs-anuncios.component';

import { ConfigPage } from './config.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigPage
  },
  {
    path: 'anuncio',
    component: AnuncioComponent
  },
  {
    path: 'packs_anuncios',
    component: PacksAnunciosComponent
  },
  {
    path: 'info_perso',
    component: InformacionPersonalComponent
  },
  {
    path: 'negocios',
    component: NegociosComponent
  },
  {
    path: 'cuenta-acceso',
    component: CuentaAccesoComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigPageRoutingModule {}
