import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortalGunService {
  private subjectToTeleport = new BehaviorSubject('');
  currentSubjectToTeleport: any = this.subjectToTeleport.asObservable();
  constructor() { }
  updateSubjectToTeleport(subject:any) {
    this.subjectToTeleport.next(subject);
  }
}
