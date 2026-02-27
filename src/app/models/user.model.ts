/**
 * Interface représentant un utilisateur de l'application
 */
export interface User {
  id?: number;  // Optionnel car généré lors de l'inscription
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  password?: string;  // Optionnel, ne pas stocker/envoyer en production
}
