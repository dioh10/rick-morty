import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {saveEvent} from '../../store/log.actions';
import {ApiConnectionsService} from '../../services/api-connections.service';
import {SearchCommunicatorService} from '../../services/search-communicator.service';
import {PortalGunService} from '../../services/portal-gun.service';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.css']
})
export class EpisodesComponent implements OnInit {
  log$: Observable<any>;
  episodes: any = [];
  filteredEpisodes: any = [];
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
      this.searchEpisode();
    });
    this.detectScroll();
    this.getEpisodes();
  }

  getEpisodes() {
    this.api.getListOfEpisodes(this.currentPage).subscribe({
      next: (data: any) => {
        this.store.dispatch(saveEvent('Episodes loaded'));
        this.episodes.push(...data.results);
        this.filteredEpisodes.push(...data.results);
        this.totalLocations = data.info.count;
        this.totalPages = data.info.pages;
      },
      error: (err) => {
        this.store.dispatch(saveEvent('Error loading episodes: ' + err));
      },
      complete: () => {
        if (this.term.length > 0) {
          this.searchEpisode();
        }
      }
    });
  }

  searchEpisode() {
    if(this.term.length > 0) {
      this.store.dispatch(saveEvent('Searching episode: ' + this.term));
    }
    this.episodes = this.filteredEpisodes
    this.episodes = this.episodes.filter((character: any) => {
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
      this.getEpisodes();
    }
  }

  teleport(episode: any) {
    this.store.dispatch(saveEvent('Going to the page of ' + episode.name));
    this.portalGunService.updateSubjectToTeleport(episode);
    this.router.navigate(['episodes',this.removeSpacesFromString(episode.name.toLowerCase())])
      .then(()=>{
        this.searchService.updateSearchTerm('');
      });
  }

  removeSpacesFromString(string: string) {
    return string.replace(/\s/g, '');
  }

}
