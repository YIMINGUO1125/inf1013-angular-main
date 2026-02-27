import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Annonce } from '../../../../models/annonce.model';
import { AnnoncesService } from '../../annonces';

@Component({
  selector: 'app-mes-annonces',
  standalone: false,
  templateUrl: './mes-annonces.html',
  styleUrls: ['./mes-annonces.css']
})
export class MesAnnonces {
  readonly mesAnnonces$: Observable<Annonce[]>;

  // Jalon I mock user id
  private readonly currentUserId = 1;

  constructor(
    private readonly annoncesService: AnnoncesService,
    private readonly router: Router
  ) {
    this.mesAnnonces$ = this.annoncesService.getAnnonces().pipe(
      map((annonces) =>
        annonces.filter((annonce) => {
          const proprietaireId =
            (annonce as Annonce & { proprietaireId?: number }).proprietaireId;
          return proprietaireId === undefined || proprietaireId === this.currentUserId;
        })
      )
    );
  }

  toggleActif(annonce: Annonce): void {
    annonce.actif = !annonce.actif;
    this.annoncesService.toggleActif(annonce.id);
  }

  modifierAnnonce(id: number): void {
    this.router.navigate(['/annonces', id, 'modifier']);
  }
}
