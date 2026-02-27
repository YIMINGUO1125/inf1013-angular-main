import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionAnnonce } from './edition-annonce';

describe('EditionAnnonce', () => {
  let component: EditionAnnonce;
  let fixture: ComponentFixture<EditionAnnonce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditionAnnonce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionAnnonce);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
