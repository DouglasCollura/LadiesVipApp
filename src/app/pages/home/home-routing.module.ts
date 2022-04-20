import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnuncioComponent } from './anuncio/anuncio.component';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'config',
    loadChildren: () => import('../profile/config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: "anuncio",
    component:AnuncioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
