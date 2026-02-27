import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Annonce } from '../../../../models/annonce.model';
import { AnnoncesService } from '../../annonces';

@Component({
  selector: 'app-liste-annonces',
  standalone: false,
  templateUrl: './liste-annonces.html',
  styleUrls: ['./liste-annonces.css']
})
 
export class ListeAnnonces {
  readonly annonces$: Observable<Annonce[]>;
   constructor(private readonly annoncesService: AnnoncesService) {
    this.annonces$ = this.annoncesService
      .getAnnonces()
      .pipe(map((annonces) => annonces.filter((annonce) => annonce.actif)));

  }
}
