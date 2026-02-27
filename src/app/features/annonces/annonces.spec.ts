import { TestBed } from '@angular/core/testing';

import { Annonces } from './annonces';

describe('Annonces', () => {
  let service: Annonces;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Annonces);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
