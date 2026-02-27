import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAnnonce } from './detail-annonce';

describe('DetailAnnonce', () => {
  let component: DetailAnnonce;
  let fixture: ComponentFixture<DetailAnnonce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailAnnonce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailAnnonce);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
