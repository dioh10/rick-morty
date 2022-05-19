import { TestBed } from '@angular/core/testing';

import { ApiConnectionsService } from './api-connections.service';

describe('ApiConnectionsService', () => {
  let service: ApiConnectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiConnectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
