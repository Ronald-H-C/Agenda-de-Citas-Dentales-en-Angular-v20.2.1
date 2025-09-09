import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    
    <main class="content">
      <h2>Bienvenido {{ auth.currentUser()?.name }}</h2>
      <p>Tu rol es: {{ auth.currentUser()?.role }}</p>
    </main>
  `,
  styles: [`
    .content {
      padding: 1rem;
    }
  `]
})
export class DashboardComponent {
  constructor(public auth: AuthService) { }
}
