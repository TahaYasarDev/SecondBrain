import { TestBed } from '@angular/core/testing';

import { BlockEvenementService } from './block-evenement.service';

describe('BlockEvenementService', () => {
  let service: BlockEvenementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockEvenementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
