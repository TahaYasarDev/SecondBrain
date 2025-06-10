import { TestBed } from '@angular/core/testing';
import { TagCountService } from './count.service';

describe('tagCountService', () => {
  let service: TagCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
