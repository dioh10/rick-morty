import { TestBed } from '@angular/core/testing';

import { SearchCommunicatorService } from './search-communicator.service';

describe('SearchCommunicatorService', () => {
  let service: SearchCommunicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchCommunicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
