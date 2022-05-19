import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiUrl} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectionsService {

  constructor(private http: HttpClient,
              ) { }

  getListOfCharacters(page: number) {
    return this.http.get(apiUrl + '/character/?page=' + page);
  }



}
