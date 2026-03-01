import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-profil',
  standalone: false,
  templateUrl: './profil.html',
  styleUrls: ['./profil.css']
})
export class Profil implements OnInit {

  profilForm!: FormGroup;
  currentUser: User | null = null;

  editMode: boolean = false; // Formulaire en édition ou lecture seule

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur connecté
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Créer le formulaire avec toutes les informations
    this.profilForm = this.fb.group({
      nom: [this.currentUser.nom, Validators.required],
      prenom: [this.currentUser.prenom, Validators.required],
      telephone: [this.currentUser.telephone, Validators.required],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      adresse: [this.currentUser.adresse, Validators.required]
    });

    // Lecture seule par défaut
    this.profilForm.disable();
  }

  // Activer l'édition du profil
  enableEdit(): void {
    this.editMode = true;
    this.profilForm.enable();
  }

  // Sauvegarder les modifications et repasser en lecture seule
  onSubmit(): void {
    if (this.profilForm.valid) {
      const updatedUser: User = {
        ...this.currentUser!,
        ...this.profilForm.value
      };

      this.authService.updateProfile(updatedUser);
      this.currentUser = updatedUser;

      // Désactiver l'édition
      this.editMode = false;
      this.profilForm.disable();

      alert('Profil mis à jour !');
    }
  }

  // Déconnexion
  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // Naviguer vers la page de création d'annonce
  creerAnnonce(): void {
    this.router.navigate(['/annonces/creer']);
  }
}