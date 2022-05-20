import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {ApiConnectionsService} from '../../services/api-connections.service';
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
  currentPage: number = 1;
  totalPages: number = 0;
  totalCharacters: number = 0;


  constructor(private api:ApiConnectionsService,
              private store: Store<{log: any}>
              ) {
    this.log$ = store.select('log');
  }

  ngOnInit(): void {
    this.detectScroll();
    this.getCharacters();
  }

  getCharacters() {
    this.api.getListOfCharacters(this.currentPage).subscribe({
      next: (data: any) => {
        this.store.dispatch(saveEvent('Characters loaded'));
        this.characters.push(...data.results);
        this.totalCharacters = data.info.count;
        this.totalPages = data.info.pages;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  detectScroll() {
      window.onscroll = () => this.detectBottomOfPage();
    }

  detectBottomOfPage() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.currentPage++;
      this.getCharacters();
    }
  }

}
