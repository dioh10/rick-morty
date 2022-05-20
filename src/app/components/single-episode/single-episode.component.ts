import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {saveEvent} from '../../store/log.actions';
import {PortalGunService} from '../../services/portal-gun.service';
import {ApiConnectionsService} from '../../services/api-connections.service';
import {Observable} from 'rxjs';
import { Location } from '@angular/common'

@Component({
  selector: 'app-single-episode',
  templateUrl: './single-episode.component.html',
  styleUrls: ['./single-episode.component.css']
})
export class SingleEpisodeComponent implements OnInit, OnDestroy {
  currentEpisode: any = {};
  charactersFromEpisode: any = [];
  log$: Observable<any>;

  constructor(private portalGunService: PortalGunService,
              private store: Store<{ log: any }>,
              private router: Router,
              private location: Location,
              private api: ApiConnectionsService,) {
    this.log$ = store.select('log');
  }

 async ngOnInit() {
    this.prepareEpisode();
    await this.getCharactersFromEpisode();
  }
  ngOnDestroy() {
    this.portalGunService.updateSubjectToTeleport('');
  }

  prepareEpisode() {
    this.portalGunService.currentSubjectToTeleport.subscribe((subject:any) => {
      if(!subject) {
        this.router.navigate(['episodes']).then(()=>{
          this.store.dispatch(saveEvent('No episode to show, went to source...'));
        });
      } else {
        this.store.dispatch(saveEvent('Episode ' + subject.name + ' loaded'));
        this.currentEpisode = subject;
      }
    });
  }

  async getCharactersFromEpisode() {
    await this.currentEpisode.characters.forEach((characterUrl: string) => {
      this.api.getSingleCharacter(characterUrl).subscribe((character: any) => {
        this.charactersFromEpisode.push(character.name);
      });
    });
    this.store.dispatch(saveEvent('Fetched characters from episode: ' + this.currentEpisode.name));
  }

  goBack() {
    this.location.back();
    this.store.dispatch(saveEvent('Going back to source after visiting ' + this.currentEpisode.name));
  }

}
