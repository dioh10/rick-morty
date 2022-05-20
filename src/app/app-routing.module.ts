import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CharactersComponent} from './components/characters/characters.component';
import {LocationsComponent} from './components/locations/locations.component';
import {EpisodesComponent} from './components/episodes/episodes.component';
import {SingleCharacterComponent} from './components/single-character/single-character.component';
import {SingleLocationComponent} from './components/single-location/single-location.component';
import {SingleEpisodeComponent} from './components/single-episode/single-episode.component';

const routes: Routes = [
  {path: '', component: CharactersComponent},
  {path: 'character/:name', component: SingleCharacterComponent},
  {path: 'locations', component: LocationsComponent},
  {path: 'locations/:name', component: SingleLocationComponent},
  {path: 'episodes', component: EpisodesComponent},
  {path: 'episodes/:name', component: SingleEpisodeComponent},
  {path: '**', pathMatch: 'full', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
