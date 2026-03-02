import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ListeAnnonces } from './features/annonces/pages/liste-annonces/liste-annonces';
import { DetailAnnonce } from './features/annonces/pages/detail-annonce/detail-annonce';
import { EditionAnnonce } from './features/annonces/pages/edition-annonce/edition-annonce';
import { Login } from './features/auth/pages/login/login';
import { Inscription } from './features/auth/pages/inscription/inscription';
import { Profil } from './features/auth/pages/profil/profil';
import { AnnonceCard } from './shared/components/annonce-card/annonce-card';
import { MesAnnonces } from './features/annonces/pages/mes-annonces/mes-annonces';

@NgModule({
  declarations: [
    App,
    ListeAnnonces,
    DetailAnnonce,
    EditionAnnonce,
    Login,
    Inscription,
    Profil,
    AnnonceCard,
    MesAnnonces
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }
