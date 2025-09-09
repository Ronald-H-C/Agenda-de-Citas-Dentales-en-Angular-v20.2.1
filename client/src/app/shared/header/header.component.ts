import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="logo">🌿 Dento</div>
      <nav class="nav">
        <span *ngIf="auth.currentUser()">Hola, {{ auth.currentUser()?.name }}</span>
        <button *ngIf="auth.isLoggedIn()" (click)="logout()">Cerrar sesión</button>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #1976d2;
      color: white;
    }
    .logo {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .nav {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    button {
      background: #ef5350;
      border: none;
      padding: 0.5rem 1rem;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #d32f2f;
    }
  `]
})
export class HeaderComponent {
  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
