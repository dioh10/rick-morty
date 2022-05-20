import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {saveEvent} from '../../store/log.actions';
import {ApiConnectionsService} from '../../services/api-connections.service';
import {SearchCommunicatorService} from '../../services/search-communicator.service';
import {PortalGunService} from '../../services/portal-gun.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit, OnDestroy {
  log$: Observable<any>;
  characters: any = [];
  filteredCharacters: any = [];
  term: string = '';
  columns: number = 1;
  currentPage: number = 1;
  totalPages: number = 0;
  totalCharacters: number = 0;



  constructor(private api: ApiConnectionsService,
              private store: Store<{ log: any }>,
              private searchService: SearchCommunicatorService,
              private portalGunService: PortalGunService,
              private router: Router) {
    this.log$ = store.select('log');
  }

  ngOnInit(): void {
    this.searchService.currentSearchTerm.subscribe(term => {
      this.term = term;
      this.searchCharacter();
    });
    this.detectScroll();
    this.getCharacters();
  }

  ngOnDestroy() {
    this.searchService.updateSearchTerm('');
  }

  getCharacters() {
    this.api.getListOfCharacters(this.currentPage).subscribe({
      next: (data: any) => {
        this.store.dispatch(saveEvent('Characters loaded'));
        this.characters.push(...data.results);
        this.filteredCharacters.push(...data.results);
        this.totalCharacters = data.info.count;
        this.totalPages = data.info.pages;
      },
      error: (err) => {
        this.store.dispatch(saveEvent('Error loading characters: ' + err));
      },
      complete: () => {
        if (this.term.length > 0) {
          this.searchCharacter();
        }
      }
    });
  }

  searchCharacter() {
    if(this.term.length>0) {
      this.store.dispatch(saveEvent('Searching character: ' + this.term));
    }
    this.characters = this.filteredCharacters
    this.characters = this.characters.filter((character: any) => {
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
      this.getCharacters();
    }
  }

  teleport(character: any) {
    this.store.dispatch(saveEvent('Going to the page of ' + character.name));
    this.portalGunService.updateSubjectToTeleport(character);
    this.router.navigate(['character', this.removeSpacesFromString(character.name.toLowerCase())])
      .then(() => {
        this.searchService.updateSearchTerm('');
      });
  }

  removeSpacesFromString(string: string) {
    return string.replace(/\s/g, '');
  }
}
