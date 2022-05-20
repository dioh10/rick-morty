import {Component, OnChanges, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiConnectionsService} from '../../services/api-connections.service';
import {SearchCommunicatorService} from '../../services/search-communicator.service';
import {Store} from '@ngrx/store';
import {saveEvent} from '../../store/log.actions';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
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
              private searchService: SearchCommunicatorService) {
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
    this.store.dispatch(saveEvent('Searching character: ' + this.term));
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

  /*onResize(event: Event) {
    this.store.dispatch(saveEvent('Changing breakpoints...'));
  }*/
}
