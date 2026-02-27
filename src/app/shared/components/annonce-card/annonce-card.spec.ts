import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnonceCard } from './annonce-card';

describe('AnnonceCard', () => {
  let component: AnnonceCard;
  let fixture: ComponentFixture<AnnonceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnonceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnonceCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
