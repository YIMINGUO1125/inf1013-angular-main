<<<<<<< HEAD
# 🏠 Application d'Annonces de Logements - Jalon 1

## 📋 Objectif du Jalon 1

Développer une version fonctionnelle du front-end avec Angular et Angular Material, **sans backend réel**. L'application doit être complète visuellement et structurellement, avec des données simulées (JSON), prête à être connectée aux microservices au Jalon 2.

---

## 👥 Répartition des tâches

| Membre | Responsabilité | Statut |
|--------|----------------|--------|
| **Océane** | Structure & Configuration | ✅ **TERMINÉ** |
| **Yimin** | Gestion des annonces | ⏳ À faire |
| **Kardiata** | Authentification & Profil | ⏳ À faire |

---

## ✅ Partie 1 - Structure & Configuration (Océane) - TERMINÉ

### Ce qui a été fait :
- ✅ Initialisation du projet Angular avec routing
- ✅ Installation et configuration d'Angular Material (thème Indigo/Pink)
- ✅ Configuration du routing avec guards
- ✅ Création de la navbar (barre de navigation)
- ✅ Modèles TypeScript créés :
  - `core/models/annonce.model.ts` (interface Annonce)
  - `core/models/user.model.ts` (interface User)
- ✅ Fichier JSON avec annonces simulées : `assets/annonces.json`
- ✅ Service des annonces : `features/annonces/annonces.ts`
- ✅ Service d'authentification : `core/auth.ts`
- ✅ AuthGuard : `core/auth.guard.ts`
- ✅ Tous les composants de pages générés
- ✅ Composant réutilisable : `shared/components/annonce-card`
- ✅ Configuration de tous les modules Material

### Structure du projet :
```
src/app/
├── core/
│   ├── models/
│   │   ├── annonce.model.ts
│   │   └── user.model.ts
│   ├── auth.ts              # Service d'authentification
│   └── auth.guard.ts        # Protection des routes
│
├── features/
│   ├── annonces/
│   │   ├── pages/
│   │   │   ├── liste-annonces/      # Liste de toutes les annonces
│   │   │   ├── detail-annonce/      # Détail d'une annonce
│   │   │   ├── edition-annonce/     # Créer/modifier annonce
│   │   │   └── mes-annonces/        # Mes annonces (à créer)
│   │   └── annonces.ts              # Service annonces
│   │
│   └── auth/
│       └── pages/
│           ├── login/               # Connexion
│           ├── inscription/         # Inscription
│           └── profil/              # Profil utilisateur
│
├── shared/
│   └── components/
│       └── annonce-card/            # Composant réutilisable
│
├── app.ts                           # Composant racine
├── app.html                         # Navbar + router-outlet
└── app-module.ts                    # Module principal
```

---

## ⏳ Partie 2 - Gestion des Annonces (Yimin) - À FAIRE

### Dossier de travail : `src/app/features/annonces/pages/`

### 📋 Exigences du prof à implémenter :

#### ✅ Fonctionnalités obligatoires :
1. **Liste de toutes les annonces** (visiteurs et connectés)
2. **Détail d'une annonce** avec tous les champs
3. **Formulaire de création/modification** avec :
   - Titre
   - Description courte
   - Description longue
   - Mensualité
   - Date de disponibilité
   - Adresse de localisation
   - **Upload de photos** (une ou plusieurs)
4. **Page "Mes annonces"** (utilisateur connecté uniquement) avec :
   - Liste de ses annonces
   - Nombre de consultations par annonce
   - Bouton Désactiver/Réactiver
5. **Contact annonceur** : Formulaire avec sujet + message (connecté seulement)

---

### 🎯 Tâche 2.1 : Liste de toutes les annonces (`liste-annonces/`)
**Fichiers :** `liste-annonces.ts`, `liste-annonces.html`, `liste-annonces.css`

**À faire :**
- Charger les annonces avec `AnnoncesService.getAnnonces()`
- Filtrer uniquement les annonces actives (`actif: true`)
- Utiliser `<app-annonce-card>` pour chaque annonce
- Afficher un message si aucune annonce
- Layout en grille responsive

**Code de départ :**
```typescript
import { Component, OnInit } from '@angular/core';
import { AnnoncesService } from '../../annonces';
import { Annonce } from '../../../../core/models/annonce.model';

export class ListeAnnonces implements OnInit {
  annonces: Annonce[] = [];
  loading: boolean = true;

  constructor(private annoncesService: AnnoncesService) {}

  ngOnInit(): void {
    this.annoncesService.getAnnonces().subscribe({
      next: (data) => {
        this.annonces = data.filter(a => a.actif);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
      }
    });
  }
}
```

**Template :**
```html
<div class="page-container">
  <h1>Annonces disponibles</h1>

  <div *ngIf="loading" class="loading">
    <mat-spinner></mat-spinner>
  </div>

  <div *ngIf="!loading" class="annonces-grid">
    <app-annonce-card *ngFor="let annonce of annonces" [annonce]="annonce">
    </app-annonce-card>
  </div>

  <div *ngIf="!loading && annonces.length === 0" class="no-results">
    <p>Aucune annonce disponible</p>
  </div>
</div>
```

---

### 🎯 Tâche 2.2 : Détail d'une annonce avec contact (`detail-annonce/`)
**Fichiers :** `detail-annonce.ts`, `detail-annonce.html`, `detail-annonce.css`

**⚠️ IMPORTANT : Inclure un formulaire de contact (sujet + message)**

**À faire :**
- Récupérer l'ID depuis l'URL avec `ActivatedRoute`
- Charger l'annonce correspondante
- Afficher TOUS les champs + photos
- **Formulaire de contact** : Sujet + Message (si connecté uniquement)
- Si non connecté, afficher un message "Connectez-vous pour contacter"

**Code de départ :**
```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnoncesService } from '../../annonces';
import { AuthService } from '../../../../core/auth';
import { Annonce } from '../../../../core/models/annonce.model';

export class DetailAnnonce implements OnInit {
  annonce?: Annonce;
  contactForm!: FormGroup;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private annoncesService: AnnoncesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.annoncesService.getAnnonces().subscribe(annonces => {
      this.annonce = annonces.find(a => a.id === id);
    });

    // Formulaire de contact
    this.contactForm = this.fb.group({
      sujet: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  envoyerMessage(): void {
    if (this.contactForm.valid) {
      console.log('Message envoyé (simulé):', this.contactForm.value);
      alert('Votre message a été envoyé à l'annonceur !');
      this.contactForm.reset();
    }
  }
}
```

**Template :**
```html
<div class="page-container" *ngIf="annonce">
  <button mat-button routerLink="/annonces">
    <mat-icon>arrow_back</mat-icon> Retour
  </button>

  <mat-card class="detail-card">
    <mat-card-header>
      <mat-card-title>{{ annonce.titre }}</mat-card-title>
      <mat-card-subtitle>{{ annonce.adresse }}</mat-card-subtitle>
    </mat-card-header>

    <mat-card-content>
      <!-- Photos (à implémenter avec affichage d'images) -->

      <h3>Description</h3>
      <p>{{ annonce.descriptionLongue }}</p>

      <div class="info-grid">
        <div><strong>Mensualité:</strong> {{ annonce.mensualite }} $</div>
        <div><strong>Disponible le:</strong> {{ annonce.dateDisponibilite | date:'dd/MM/yyyy' }}</div>
        <div><strong>Consultations:</strong> {{ annonce.consultations }}</div>
      </div>

      <!-- Formulaire de contact -->
      <div class="contact-section">
        <h3>Contacter l'annonceur</h3>

        <div *ngIf="!isLoggedIn" class="login-prompt">
          <p>Vous devez être connecté pour contacter l'annonceur</p>
          <button mat-raised-button color="primary" routerLink="/auth/login">
            Se connecter
          </button>
        </div>

        <form *ngIf="isLoggedIn" [formGroup]="contactForm" (ngSubmit)="envoyerMessage()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Sujet</mat-label>
            <input matInput formControlName="sujet" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Message</mat-label>
            <textarea matInput formControlName="message" rows="4" required></textarea>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="!contactForm.valid">
            Envoyer le message
          </button>
        </form>
      </div>
    </mat-card-content>
  </mat-card>
</div>
```

---

### 🎯 Tâche 2.3 : Création/Modification d'annonce avec photos (`edition-annonce/`)
**Fichiers :** `edition-annonce.ts`, `edition-annonce.html`, `edition-annonce.css`

**⚠️ IMPORTANT : Inclure l'upload de photos (une ou plusieurs)**

**À faire :**
- Formulaire réactif avec TOUS les champs
- **Upload de photos** (input file avec preview)
- Validation avec `Validators.required`
- Appeler `AnnoncesService.createAnnonce()` à la soumission
- Pour le Jalon 1 : simuler l'upload (stocker en base64 ou juste les noms)

**Modules à ajouter dans `app-module.ts` :**
```typescript
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Dans imports: [...]
MatDatepickerModule,
MatNativeDateModule
```

**Code de départ :**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnnoncesService } from '../../annonces';
import { Annonce } from '../../../../core/models/annonce.model';

export class EditionAnnonce implements OnInit {
  annonceForm!: FormGroup;
  photosPreview: string[] = [];

  constructor(
    private fb: FormBuilder,
    private annoncesService: AnnoncesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.annonceForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(100)]],
      descriptionCourte: ['', [Validators.required, Validators.maxLength(200)]],
      descriptionLongue: ['', Validators.required],
      mensualite: ['', [Validators.required, Validators.min(0)]],
      dateDisponibilite: ['', Validators.required],
      adresse: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photosPreview.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number): void {
    this.photosPreview.splice(index, 1);
  }

  onSubmit(): void {
    if (this.annonceForm.valid) {
      const nouvelleAnnonce: Annonce = {
        id: Date.now(),
        ...this.annonceForm.value,
        photos: this.photosPreview, // Pour le Jalon 1
        consultations: 0,
        actif: true
      };

      this.annoncesService.createAnnonce(nouvelleAnnonce);
      alert('Annonce créée avec succès !');
      this.router.navigate(['/annonces']);
    }
  }
}
```

**Template (avec upload de photos) :**
```html
<div class="page-container">
  <h1>Publier une annonce</h1>

  <mat-card>
    <mat-card-content>
      <form [formGroup]="annonceForm" (ngSubmit)="onSubmit()">

        <!-- Titre -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre de l'annonce</mat-label>
          <input matInput formControlName="titre" required>
          <mat-error *ngIf="annonceForm.get('titre')?.hasError('required')">
            Champ obligatoire
          </mat-error>
        </mat-form-field>

        <!-- Description courte -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description courte</mat-label>
          <textarea matInput formControlName="descriptionCourte" rows="2" required></textarea>
          <mat-hint>Maximum 200 caractères</mat-hint>
        </mat-form-field>

        <!-- Description longue -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description complète</mat-label>
          <textarea matInput formControlName="descriptionLongue" rows="6" required></textarea>
        </mat-form-field>

        <!-- Mensualité -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mensualité (en $)</mat-label>
          <input matInput type="number" formControlName="mensualite" required>
          <span matPrefix>$ &nbsp;</span>
        </mat-form-field>

        <!-- Date de disponibilité -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date de disponibilité</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateDisponibilite" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <!-- Adresse -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Adresse de localisation</mat-label>
          <input matInput formControlName="adresse" required>
          <mat-icon matPrefix>location_on</mat-icon>
        </mat-form-field>

        <!-- Upload photos -->
        <div class="photo-section">
          <h3>Photos du logement</h3>
          <input type="file" accept="image/*" multiple (change)="onFileSelected($event)" #fileInput style="display: none">
          <button mat-raised-button type="button" (click)="fileInput.click()">
            <mat-icon>add_photo_alternate</mat-icon>
            Ajouter des photos
          </button>

          <!-- Preview des photos -->
          <div class="photos-preview" *ngIf="photosPreview.length > 0">
            <div *ngFor="let photo of photosPreview; let i = index" class="photo-item">
              <img [src]="photo" alt="Photo">
              <button mat-icon-button type="button" (click)="removePhoto(i)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Boutons -->
        <div class="form-actions">
          <button mat-button type="button" routerLink="/annonces">Annuler</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!annonceForm.valid">
            Publier l'annonce
          </button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>
</div>
```

**CSS pour les photos :**
```css
.photo-section {
  margin: 20px 0;
}

.photos-preview {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.photo-item {
  position: relative;
  width: 120px;
  height: 120px;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.photo-item button {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
}
```

---

### 🎯 Tâche 2.4 : ⚠️ NOUVEAU - Page "Mes annonces" (`mes-annonces/`)

**⚠️ Ce composant n'existe pas encore, il faut le créer !**

```bash
ng g c features/annonces/pages/mes-annonces
```

**Ajouter la route dans `app-routing-module.ts` :**
```typescript
{
  path: 'mes-annonces',
  component: MesAnnonces,
  canActivate: [AuthGuard]
}
```

**Fichiers :** `mes-annonces.ts`, `mes-annonces.html`, `mes-annonces.css`

**À faire :**
- Afficher uniquement les annonces de l'utilisateur connecté
- Afficher le nombre de consultations pour chaque annonce
- Bouton "Désactiver" (passe `actif: false`)
- Bouton "Réactiver" (passe `actif: true`)
- Bouton "Modifier" (navigation vers edition-annonce avec ID)

**Code de départ :**
```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth';
import { AnnoncesService } from '../../annonces';
import { Annonce } from '../../../../core/models/annonce.model';

export class MesAnnonces implements OnInit {
  mesAnnonces: Annonce[] = [];
  currentUser: any;

  constructor(
    private authService: AuthService,
    private annoncesService: AnnoncesService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Pour le Jalon 1, simuler avec toutes les annonces
    // Au Jalon 2, filtrer par userId
    this.annoncesService.getAnnonces().subscribe(annonces => {
      this.mesAnnonces = annonces;
    });
  }

  toggleActif(annonce: Annonce): void {
    // Pour le Jalon 1 : simulation
    annonce.actif = !annonce.actif;
    console.log('Annonce', annonce.id, 'actif:', annonce.actif);
    alert(annonce.actif ? 'Annonce réactivée' : 'Annonce désactivée');
  }
}
```

**Template :**
```html
<div class="page-container">
  <h1>Mes annonces</h1>

  <div *ngIf="mesAnnonces.length === 0" class="no-results">
    <p>Vous n'avez pas encore d'annonces</p>
    <button mat-raised-button color="primary" routerLink="/annonces/nouvelle">
      Créer une annonce
    </button>
  </div>

  <div *ngFor="let annonce of mesAnnonces" class="annonce-item">
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ annonce.titre }}</mat-card-title>
        <mat-card-subtitle>
          <mat-chip [class.inactive]="!annonce.actif">
            {{ annonce.actif ? 'Active' : 'Désactivée' }}
          </mat-chip>
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <p>{{ annonce.descriptionCourte }}</p>
        <div class="stats">
          <mat-icon>visibility</mat-icon>
          <span>{{ annonce.consultations }} consultations</span>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button mat-button [routerLink]="['/annonces', annonce.id]">Voir</button>
        <button mat-button>Modifier</button>
        <button mat-button [color]="annonce.actif ? 'warn' : 'primary'" (click)="toggleActif(annonce)">
          {{ annonce.actif ? 'Désactiver' : 'Réactiver' }}
        </button>
      </mat-card-actions>
    </mat-card>
  </div>
</div>
```

---

### ⚠️ Mettre à jour le modèle Annonce

**Ouvrir `src/app/core/models/annonce.model.ts` et ajouter le champ photos :**

```typescript
export interface Annonce {
  id: number;
  titre: string;
  descriptionCourte: string;
  descriptionLongue: string;
  mensualite: number;
  dateDisponibilite: string;
  adresse: string;
  photos?: string[];  // ← AJOUTER
  consultations: number;
  actif: boolean;
}
```

---

## ⏳ Partie 3 - Authentification & Profil (Kardiata) - À FAIRE

### Dossier de travail : `src/app/features/auth/pages/` + `src/app/core/auth.ts`

### 📋 Exigences du prof à implémenter :

#### ✅ Fonctionnalités obligatoires :
1. **Connexion** (simulation avec localStorage)
2. **Inscription** avec tous les champs : nom, prénom, téléphone, courriel, adresse
3. **Profil utilisateur** : Affichage et modification
4. **AuthGuard** : Protéger les routes (création annonce, mes annonces, profil)
5. **Navbar dynamique** : Afficher liens selon l'état de connexion

---

### 🎯 Tâche 3.1 : Page de connexion (`login/`)
**Fichiers :** `login.ts`, `login.html`, `login.css`

**À faire :**
- Formulaire avec email et password
- Validation email avec `Validators.email`
- Appeler `AuthService.login(email, password)`
- Rediriger vers `/annonces` si succès
- Afficher message d'erreur si échec

**Code de départ :**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth';

export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => this.router.navigate(['/annonces']),
        error: () => this.errorMessage = 'Email ou mot de passe incorrect'
      });
    }
  }
}
```

**Template :**
```html
<div class="page-container">
  <mat-card class="login-card">
    <mat-card-header>
      <mat-card-title>Connexion</mat-card-title>
    </mat-card-header>

    <mat-card-content>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Courriel</mat-label>
          <input matInput type="email" formControlName="email" required>
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
            Champ obligatoire
          </mat-error>
          <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
            Email invalide
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mot de passe</mat-label>
          <input matInput type="password" formControlName="password" required>
          <mat-icon matPrefix>lock</mat-icon>
        </mat-form-field>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="!loginForm.valid">
          Se connecter
        </button>

        <p class="link-text">
          Pas de compte ? <a routerLink="/auth/inscription">Inscrivez-vous</a>
        </p>
      </form>
    </mat-card-content>
  </mat-card>
</div>
```

**Compte de test :**
- Email : `test@test.com`
- Mot de passe : `123456`

---

### 🎯 Tâche 3.2 : Page d'inscription (`inscription/`)
**Fichiers :** `inscription.ts`, `inscription.html`, `inscription.css`

**⚠️ IMPORTANT : Tous les champs obligatoires selon le prof**
- Nom
- Prénom
- Numéro de téléphone
- Courriel
- Adresse personnelle
- Mot de passe

**Code de départ :**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth';

export class Inscription implements OnInit {
  inscriptionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inscriptionForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.inscriptionForm.valid) {
      const userData = { ...this.inscriptionForm.value };
      delete userData.confirmPassword;
      this.authService.register(userData).subscribe({
        next: () => {
          alert('Compte créé !');
          this.router.navigate(['/auth/login']);
        }
      });
    }
  }
}
```

**Template avec TOUS les champs :**
```html
<div class="page-container">
  <mat-card>
    <mat-card-header>
      <mat-card-title>Créer un compte</mat-card-title>
    </mat-card-header>

    <mat-card-content>
      <form [formGroup]="inscriptionForm" (ngSubmit)="onSubmit()">

        <!-- Nom et Prénom -->
        <div class="row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="nom" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="prenom" required>
          </mat-form-field>
        </div>

        <!-- Téléphone -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Numéro de téléphone</mat-label>
          <input matInput type="tel" formControlName="telephone" required>
          <mat-icon matPrefix>phone</mat-icon>
        </mat-form-field>

        <!-- Email -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Courriel</mat-label>
          <input matInput type="email" formControlName="email" required>
          <mat-icon matPrefix>email</mat-icon>
        </mat-form-field>

        <!-- Adresse -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Adresse personnelle</mat-label>
          <input matInput formControlName="adresse" required>
          <mat-icon matPrefix>location_on</mat-icon>
        </mat-form-field>

        <!-- Mot de passe -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mot de passe</mat-label>
          <input matInput type="password" formControlName="password" required>
          <mat-icon matPrefix>lock</mat-icon>
        </mat-form-field>

        <!-- Confirmation -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirmer le mot de passe</mat-label>
          <input matInput type="password" formControlName="confirmPassword" required>
          <mat-icon matPrefix>lock</mat-icon>
        </mat-form-field>

        <div *ngIf="inscriptionForm.hasError('passwordMismatch')" class="error-message">
          Les mots de passe ne correspondent pas
        </div>

        <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="!inscriptionForm.valid">
          Créer mon compte
        </button>

        <p class="link-text">
          Déjà un compte ? <a routerLink="/auth/login">Connectez-vous</a>
        </p>
      </form>
    </mat-card-content>
  </mat-card>
</div>
```

---

### 🎯 Tâche 3.3 : Page de profil (`profil/`)
**Fichiers :** `profil.ts`, `profil.html`, `profil.css`

**À faire :**
- Récupérer l'utilisateur avec `AuthService.getCurrentUser()`
- Pré-remplir le formulaire
- Permettre la modification de TOUS les champs
- Bouton "Enregistrer" → `AuthService.updateProfile()`
- Bouton "Se déconnecter" → `AuthService.logout()`

**Code de départ :**
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth';
import { User } from '../../../../core/models/user.model';

export class Profil implements OnInit {
  profilForm!: FormGroup;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.profilForm = this.fb.group({
      nom: [this.currentUser.nom, Validators.required],
      prenom: [this.currentUser.prenom, Validators.required],
      telephone: [this.currentUser.telephone, Validators.required],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      adresse: [this.currentUser.adresse, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.profilForm.valid) {
      const updatedUser = { ...this.currentUser, ...this.profilForm.value };
      this.authService.updateProfile(updatedUser);
      alert('Profil mis à jour !');
    }
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/annonces']);
  }
}
```

---

### 🎯 Tâche 3.4 : ⚠️ IMPORTANT - Mettre à jour la navbar

**Fichier :** `src/app/app.html`

**Afficher les liens selon l'état de connexion :**

```html
<mat-toolbar color="primary">
  <span>Application d'annonces</span>
  <span class="spacer"></span>

  <a mat-button routerLink="/annonces">Annonces</a>

  <!-- Si NON connecté -->
  <ng-container *ngIf="!authService.isLoggedIn()">
    <a mat-button routerLink="/auth/login">Connexion</a>
    <a mat-button routerLink="/auth/inscription">Inscription</a>
  </ng-container>

  <!-- Si connecté -->
  <ng-container *ngIf="authService.isLoggedIn()">
    <a mat-button routerLink="/mes-annonces">Mes annonces</a>
    <a mat-button routerLink="/annonces/nouvelle">Nouvelle annonce</a>
    <a mat-button routerLink="/auth/profil">Mon profil</a>
    <button mat-button (click)="deconnexion()">
      <mat-icon>logout</mat-icon>
      Déconnexion
    </button>
  </ng-container>
</mat-toolbar>

<main class="container">
  <router-outlet></router-outlet>
</main>
```

**Et dans `src/app/app.ts` :**
```typescript
import { Component } from '@angular/core';
import { AuthService } from './core/auth';
import { Router } from '@angular/router';

export class App {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/annonces']);
  }
}
```

---

## 🛠️ Conventions de code

### Nommage des fichiers
Ce projet utilise des **noms courts** :
- Fichier : `login.ts` (pas `login.component.ts`)
- Classe : `export class Login`

### Imports
```typescript
// ✅ CORRECT
import { Login } from './features/auth/pages/login/login';
import { Annonce } from './core/models/annonce.model';

// ❌ FAUX
import { LoginComponent } from './features/auth/pages/login/login.component';
```

### Avec une IA
Précisez : *"Ce projet utilise des noms courts (login.ts, pas login.component.ts)"*

---

## 🐛 Debugging - Problèmes courants

### Page blanche
1. Console (F12) → regarder les erreurs
2. Vérifier que `ng serve` compile sans erreur

### "Cannot find module"
Vérifier le chemin d'import (noms courts)

### Formulaire ne valide pas
Vérifier que `ReactiveFormsModule` est dans `app-module.ts`

### Material ne s'affiche pas
Vérifier que le module Material est importé (ex: `MatCardModule`)

### Erreur datepicker
Ajouter dans `app-module.ts` :
```typescript
MatDatepickerModule,
MatNativeDateModule
```

### Erreur photos
Vérifier que `photos?: string[]` est bien dans le modèle `Annonce`

---

## ✅ Checklist avant remise

### Fonctionnalités OBLIGATOIRES du prof
- [ ] **Liste de toutes les annonces** (actives uniquement)
- [ ] **Détail d'une annonce** avec tous les champs
- [ ] **Formulaire de contact** (sujet + message) pour annonceur
- [ ] **Création d'annonce** avec photos (une ou plusieurs)
- [ ] **Page "Mes annonces"** avec nombre de consultations
- [ ] **Désactiver/Réactiver** une annonce
- [ ] **Connexion** simulée (localStorage)
- [ ] **Inscription** avec tous les champs (nom, prénom, téléphone, email, adresse)
- [ ] **Profil** : affichage et modification
- [ ] **AuthGuard** protège les routes (mes annonces, création, profil)
- [ ] **Navbar dynamique** selon connexion
- [ ] **Visite des annonces** accessible à tous
- [ ] **Interaction avec annonceurs** uniquement si connecté

### Technique
- [ ] Angular Material intégré
- [ ] Données simulées (JSON)
- [ ] Envoi s'arrête au niveau service (pas de backend)
- [ ] Application compile (`ng build --configuration production`)
- [ ] Pas de console.log inutiles

### Déploiement
- [ ] Déployé sur Firebase
- [ ] Code sur GitLab (dmigit.uqtr.ca)

---

## 🚀 Déploiement Firebase (Océane)

### Quand ?
Une fois que **toutes les fonctionnalités sont terminées**.

### Étapes :
```bash
# 1. Builder
ng build --configuration production

# 2. Se connecter
firebase login

# 3. Initialiser
firebase init
# Choisir: Hosting
# Public: dist/annonces-app/browser
# Single-page: Yes

# 4. Déployer
firebase deploy
```

---

## 📦 Résumé des requis du prof

✅ Toutes fonctionnalités UI implémentées  
✅ Angular Material utilisé  
✅ Données simulées (JSON local)  
✅ Envoi s'arrête au service (pas de backend)  
✅ Déploiement Firebase  
✅ Code sur GitLab  

---

**Dernière mise à jour** : 13 février 2026  
**GitLab** : https://dmigit.uqtr.ca/[votre-equipe]/annonces-app
=======
# inf1013-angular-main
>>>>>>> 15bb25e5880c9827d14c7f01bf8bf856fb63f5a6
