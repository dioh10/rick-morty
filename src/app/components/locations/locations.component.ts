import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {saveEvent} from '../../store/log.actions';
import {ApiConnectionsService} from '../../services/api-connections.service';
import {SearchCommunicatorService} from '../../services/search-communicator.service';
import {PortalGunService} from '../../services/portal-gun.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  log$: Observable<any>;
  locations: any = [];
  filteredLocations: any = [];
  term: string = '';
  columns: number = 1;
  currentPage: number = 1;
  totalPages: number = 0;
  totalLocations: number = 0;

  constructor(
    private api: ApiConnectionsService,
    private store: Store<{ log: any }>,
    private searchService: SearchCommunicatorService,
    private portalGunService: PortalGunService,
    private router: Router
  ) {
    this.log$ = store.select('log');
  }

  ngOnInit(): void {
    this.searchService.currentSearchTerm.subscribe(term => {
      this.term = term;
      this.searchLocation();
    });
    this.detectScroll();
    this.getLocations();
  }

  getLocations() {
    this.api.getListOfLocations(this.currentPage).subscribe({
      next: (data: any) => {
        this.store.dispatch(saveEvent('Locations loaded'));
        this.locations.push(...data.results);
        this.filteredLocations.push(...data.results);
        this.totalLocations = data.info.count;
        this.totalPages = data.info.pages;
      },
      error: (err) => {
        this.store.dispatch(saveEvent('Error loading locations: ' + err));
      },
      complete: () => {
        if (this.term.length > 0) {
          this.searchLocation();
        }
      }
    });
  }

  searchLocation() {
    if (this.term.length > 0) {
      this.store.dispatch(saveEvent('Searching location: ' + this.term));
    }
    this.locations = this.filteredLocations
    this.locations = this.locations.filter((character: any) => {
      return character.name.toLowerCase().includes(this.term.toLowerCase());
    })
  }

  detectScroll() {
    window.onscroll = () => this.detectBottomOfPage();
    this.store.dispatch(saveEvent('Checking scroll...'));
  }

  detectBottomOfPage() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.store.dispatch(saveEvent('Detecting bottom of page...'));
      this.currentPage++;
      this.getLocations();
    }
  }

  teleport(location: any) {
    this.store.dispatch(saveEvent('Going to the page of ' + location.name));
    this.portalGunService.updateSubjectToTeleport(location);
    this.router.navigate(['locations', this.removeSpacesFromString(location.name.toLowerCase())])
      .then(() => {
          this.searchService.updateSearchTerm('');
        }
      );
  }

  removeSpacesFromString(string: string) {
    return string.replace(/\s/g, '');
  }
}
