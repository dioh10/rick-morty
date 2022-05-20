import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchCommunicatorService {
  private searchTerm = new BehaviorSubject('');
  currentSearchTerm = this.searchTerm.asObservable();

  constructor() { }
  updateSearchTerm(term:string) {
    this.searchTerm.next(term);
  }
}
