import { Component, OnInit } from '@angular/core';
import { Annonce } from '../../../../models/annonce.model';
import { AnnoncesService } from '../../annonces';

@Component({
  selector: 'app-liste-annonces',
  standalone: false,
  templateUrl: './liste-annonces.html',
  styleUrls: ['./liste-annonces.css']
})
export class ListeAnnonces implements OnInit {
  annonces: Annonce[] = [];
  loading = true;

  constructor(private readonly annoncesService: AnnoncesService) {}

  ngOnInit(): void {
    this.annoncesService.getAnnonces().subscribe({
      next: (annonces) => {
        this.annonces = annonces.filter((annonce) => annonce.actif);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des annonces :', error);
        this.loading = false;
      }
    });
  }
}
