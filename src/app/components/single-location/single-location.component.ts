import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {saveEvent} from '../../store/log.actions';
import {PortalGunService} from '../../services/portal-gun.service';
import {ApiConnectionsService} from '../../services/api-connections.service';
import {Observable} from 'rxjs';
import { Location } from '@angular/common'

@Component({
  selector: 'app-single-location',
  templateUrl: './single-location.component.html',
  styleUrls: ['./single-location.component.css']
})
export class SingleLocationComponent implements OnInit, OnDestroy {
  currentLocation: any = {};
  charactersFromLocation: any = [];
  log$: Observable<any>;

  constructor(private portalGunService: PortalGunService,
              private store: Store<{ log: any }>,
              private router: Router,
              private location: Location,
              private api: ApiConnectionsService,) {
    this.log$ = store.select('log');
  }

  async ngOnInit() {
    this.prepareLocation();
    await this.getCharactersFromLocation();
  }
  ngOnDestroy() {
    this.portalGunService.updateSubjectToTeleport('');
  }

  prepareLocation() {
    this.portalGunService.currentSubjectToTeleport.subscribe((subject:any) => {
      if(!subject) {
        this.router.navigate(['locations']).then(()=>{
          this.store.dispatch(saveEvent('No location to show, went back to source...'));
        });
      } else {
        this.store.dispatch(saveEvent('Location ' + subject.name + ' loaded'));
        this.currentLocation = subject;
      }
    });
  }

  async getCharactersFromLocation() {
    await this.currentLocation.residents.forEach((characterUrl: string) => {
      this.api.getSingleCharacter(characterUrl).subscribe((character: any) => {
        this.charactersFromLocation.push(character.name);
      });
    });
    this.store.dispatch(saveEvent('Fetched characters from location: ' + this.currentLocation.name));
  }

  goBack() {
    this.location.back();
    this.store.dispatch(saveEvent('Going back to source after visiting ' + this.currentLocation.name));
    /*this.router.navigate(['locations']).then(()=>{
      this.store.dispatch(saveEvent('Going back to source after visiting ' + this.currentLocation.name));
    });*/
  }

}
