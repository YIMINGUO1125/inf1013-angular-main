import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './core/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'annonces-app';
  isLoggedIn = false;

  private authSubscription?: Subscription;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authSubscription = this.authService.loggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
