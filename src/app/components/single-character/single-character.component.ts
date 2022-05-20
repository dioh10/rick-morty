import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {saveEvent} from '../../store/log.actions';
import {PortalGunService} from '../../services/portal-gun.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-single-character',
  templateUrl: './single-character.component.html',
  styleUrls: ['./single-character.component.css']
})
export class SingleCharacterComponent implements OnInit, OnDestroy {
  currentCharacter: any = {};
  log$: Observable<any>;

  constructor(private portalGunService: PortalGunService,
              private store: Store<{ log: any }>,
              private router: Router) {
    this.log$ = store.select('log');
  }

  ngOnInit(): void {
    this.prepareCharacter();
  }
  ngOnDestroy() {
    this.portalGunService.updateSubjectToTeleport('');
  }

  prepareCharacter() {
    this.portalGunService.currentSubjectToTeleport.subscribe((subject:any) => {
      if(!subject) {
        this.router.navigate(['']).then(()=>{
          this.store.dispatch(saveEvent('No character to show, went to source...'));
        });
      } else {
        this.store.dispatch(saveEvent('Character ' + subject.name + ' loaded'));
        this.currentCharacter = subject;
      }
    });
  }
  goBack() {
    this.router.navigate(['']).then(()=>{
        this.store.dispatch(saveEvent('Going back to source...'));
    });
  }
}
