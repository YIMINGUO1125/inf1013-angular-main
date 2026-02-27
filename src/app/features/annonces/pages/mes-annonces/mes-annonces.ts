import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Annonce } from '../../../../models/annonce.model';
import { AnnoncesService } from '../../annonces';

@Component({
  selector: 'app-mes-annonces',
  standalone: false,
  templateUrl: './mes-annonces.html',
  styleUrls: ['./mes-annonces.css']
})
export class MesAnnonces implements OnInit {
  mesAnnonces: Annonce[] = [];
  loading = true;

  // Jalon I mock user id
  private readonly currentUserId = 1;

  constructor(
    private readonly annoncesService: AnnoncesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.annoncesService.getAnnonces().subscribe({
      next: (annonces) => {
        this.mesAnnonces = annonces.filter((annonce) => {
          const proprietaireId = (annonce as Annonce & { proprietaireId?: number }).proprietaireId;
          return proprietaireId === undefined || proprietaireId === this.currentUserId;
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de mes annonces :', error);
        this.loading = false;
      }
    });
  }

  toggleActif(annonce: Annonce): void {
    annonce.actif = !annonce.actif;
    this.annoncesService.toggleActif(annonce.id);
  }

  modifierAnnonce(id: number): void {
    this.router.navigate(['/annonces', id, 'modifier']);
  }
}
