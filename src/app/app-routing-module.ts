import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeAnnonces } from './features/annonces/pages/liste-annonces/liste-annonces';
import { DetailAnnonce } from './features/annonces/pages/detail-annonce/detail-annonce';
import { EditionAnnonce } from './features/annonces/pages/edition-annonce/edition-annonce';
import { MesAnnonces } from './features/annonces/pages/mes-annonces/mes-annonces';
import { Login } from './features/auth/pages/login/login';
import { Inscription } from './features/auth/pages/inscription/inscription';
import { Profil } from './features/auth/pages/profil/profil';
import { AuthGuard } from './core/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'annonces', pathMatch: 'full' },
  { path: 'mes', component: MesAnnonces, canActivate: [AuthGuard] },

  {
    path: 'annonces',
        children: [
      { path: '', component: ListeAnnonces },
      { path: 'nouvelle', component: EditionAnnonce, canActivate: [AuthGuard] },
      { path: ':id/modifier', component: EditionAnnonce, canActivate: [AuthGuard]
        //:id = Quelle annonce souhaitez-vous modifier ? /modifier = En cours de modification
       },
      { path: ':id', component: DetailAnnonce }
    ]
  },

  {
    path: 'auth',
    children: [
      { path: 'login', component: Login },
      { path: 'inscription', component: Inscription },
      { path: 'profil', component: Profil, canActivate: [AuthGuard] }
    ]
  },

  { path: '**', redirectTo: 'annonces' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
