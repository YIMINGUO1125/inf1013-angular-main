/**
 * Interface représentant une annonce de logement
 */
export interface Annonce {
  id: number;
  titre: string;
  descriptionCourte: string;
  descriptionLongue: string;
  mensualite: number;
  dateDisponibilite: string;
  adresse: string;
  consultations: number;
  actif: boolean;
  photos?: string[]; // Tableau de URLs ou de données d'images 
  userId: number; // ID de l'utilisateur qui a créé l'annonce
}

