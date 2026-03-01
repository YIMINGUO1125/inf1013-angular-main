import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'currentUser';
  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  readonly loggedIn$ = this.loggedInSubject.asObservable();
  
  constructor() {}

  /**
   * Vérifie si un utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  /**
   * Connexion d'un utilisateur
   * Pour le Jalon I : vérification avec utilisateurs de test
   * Pour le Jalon II : appel HTTP au backend SpringBoot avec JWT
   */
  login(email: string, password: string): Observable<User> {
    // Utilisateurs de test pour le Jalon I
    const testUsers: User[] = [
      {
        id: 1,
        email: 'test@test.com',
        password: '123456',
        nom: 'Tremblay',
        prenom: 'Jean',
        telephone: '819-555-0001',
        adresse: '123 rue Test, Trois-Rivières'
      },
      {
        id: 2,
        email: 'admin@test.com',
        password: 'admin',
        nom: 'Admin',
        prenom: 'Admin',
        telephone: '819-555-0002',
        adresse: '456 rue Admin, Trois-Rivières'
      }
    ];

    const user = testUsers.find(u => u.email === email && u.password === password);

    if (user) {
      // Stocker l'utilisateur (sans le mot de passe) dans localStorage
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(this.storageKey, JSON.stringify(userWithoutPassword));
      this.loggedInSubject.next(true);
      return of(userWithoutPassword);
    } else {
      return throwError(() => new Error('Identifiants incorrects'));
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(userData: User): Observable<User> {
    const newUser: User = {
      id: Date.now(),
      ...userData
    };

    console.log('Nouvel utilisateur créé:', newUser);
    // TODO Jalon II : return this.http.post<User>('/api/auth/register', userData);

    return of(newUser);
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.loggedInSubject.next(false);
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.storageKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  updateProfile(userData: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(userData));
    this.loggedInSubject.next(true)
    // TODO Jalon II : return this.http.put<User>('/api/users/profile', userData);
  }
}
