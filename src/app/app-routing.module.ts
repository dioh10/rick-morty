import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CharactersComponent} from './components/characters/characters.component';
import {LocationsComponent} from './components/locations/locations.component';
import {EpisodesComponent} from './components/episodes/episodes.component';

const routes: Routes = [
  {path: '', component: CharactersComponent},
  {path: 'locations', component: LocationsComponent},
  {path: 'episodes', component: EpisodesComponent},
  {path: '**', pathMatch: 'full', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
