import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Annonce } from '../../models/annonce.model';

@Injectable({
  providedIn: 'root' // Service singleton disponible partout dans l'application
})
export class AnnoncesService {
  // Chemin vers le fichier JSON simulé (Jalon 1)
  private readonly jsonUrl = 'assets/annonces.json';

  // Injection du HttpClient pour lire le JSON (et plus tard appeler le backend)
  constructor(private readonly http: HttpClient) {}

  //Récupère toutes les annonces depuis le fichier JSON.
   
   
  getAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(this.jsonUrl);
  }

  //Récupère une annonce par son identifiant.
  
  getAnnonceById(id: number): Observable<Annonce | undefined> {
    return this.getAnnonces().pipe(
      map((annonces) => annonces.find((a) => a.id === id))
    );
  }

  //Crée une nouvelle annonce.
  
  createAnnonce(annonce: Annonce): void {
    console.log('Création annonce (simulé):', annonce);
  }

  // Met à jour une annonce existante.
  
  updateAnnonce(id: number, annonce: Annonce): void {
    console.log('Modification annonce (simulé):', id, annonce);
  }

  // Active/Désactive une annonce.

  toggleActif(id: number): void {
    console.log('Toggle actif annonce (simulé):', id);
  }
}

// Alias de compatibilité : si du code existant importe encore `Annonces`,
export { AnnoncesService as Annonces };