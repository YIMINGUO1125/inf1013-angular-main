import { Component, Input } from '@angular/core';
import { Annonce } from '../../../models';

/**
 * Composant réutilisable pour afficher une carte d'annonce
 * Utilisation : <app-annonce-card [annonce]="monAnnonce"></app-annonce-card>
 */

@Component({
  selector: 'app-annonce-card',
  standalone: false,
  templateUrl: './annonce-card.html',
  styleUrls: ['./annonce-card.css']
})

export class AnnonceCard {
  @Input() annonce!: Annonce;  // Le "!" dit à TypeScript que cette variable sera toujours définie
}

