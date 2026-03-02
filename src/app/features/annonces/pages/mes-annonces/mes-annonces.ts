import { Component,Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../../../core/auth';
import { Annonce } from '../../../../models/annonce.model';
import { AnnoncesService } from '../../annonces';

@Component({
  selector: 'app-mes-annonces',
  standalone: false,
  templateUrl: './mes-annonces.html',
  styleUrls: ['./mes-annonces.css']
})
export class MesAnnonces {
  @Input() em = false; // Permet de réutiliser ce composant dans d'autres contextes
  readonly mesAnnonces$: Observable<Annonce[]>;

  constructor(
    private readonly annoncesService: AnnoncesService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    const currentUserId = this.authService.getCurrentUser()?.id;
    this.mesAnnonces$ = this.annoncesService.getAnnonces().pipe(
       map((annonces) => annonces.filter((annonce) => annonce.userId === currentUserId))
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
