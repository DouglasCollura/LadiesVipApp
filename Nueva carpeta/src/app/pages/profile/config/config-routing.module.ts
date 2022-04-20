import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnuncioComponent } from '../anuncio/anuncio.component';
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigPageRoutingModule {}
