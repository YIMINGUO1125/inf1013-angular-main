import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAnnonces } from './liste-annonces';

describe('ListeAnnonces', () => {
  let component: ListeAnnonces;
  let fixture: ComponentFixture<ListeAnnonces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeAnnonces]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeAnnonces);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
