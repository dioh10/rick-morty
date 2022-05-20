import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import {SearchCommunicatorService} from '../../../services/search-communicator.service';
import {Observable, debounce, interval} from 'rxjs';
import {Store} from '@ngrx/store';
import {saveEvent} from '../../../store/log.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  log$: Observable<any>;
  searchInput = new FormControl('');
  term: string = '';
  visible: boolean = true;

  constructor(private searchService: SearchCommunicatorService,
              private store: Store<{log: any}>,
              private router: Router) {
    this.log$ = store.select('log');
  }

  ngOnInit(): void {
    this.searchService.currentSearchTerm.subscribe(term => {this.term = term});
    this.searchInput.valueChanges
      .pipe(debounce(() => interval(500)))
      .subscribe(() => {
        this.search();
      });
    this.detectRouteChange();
  }

  ngOnDestroy() {
    this.searchService.updateSearchTerm('');
  }

  search() {
    this.store.dispatch(saveEvent('Searching terms: '+ this.searchInput.value));
    this.searchService.updateSearchTerm(this.searchInput.value);
  }

  detectRouteChange() {
    this.router.events.subscribe((route) => {
      this.visible = !(this.router.url !== '/' && this.router.url !== '/episodes' && this.router.url !== '/locations');
      this.searchInput.reset('');
      this.searchService.updateSearchTerm('');
    });
  }


}
