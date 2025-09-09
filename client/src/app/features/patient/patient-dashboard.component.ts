import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 Importar RouterModule
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 Incluye RouterModule
  template: `
    <main class="content">
      <h2>Panel de Paciente</h2>
      <p>
        Bienvenido {{ auth.currentUser()?.name }} 
        ({{ auth.currentUser()?.role }})
      </p>

      <nav class="menu">
        <a routerLink="appointments" routerLinkActive="active">📅 Mis Citas</a>
        <a routerLink="new-appointment" routerLinkActive="active">➕ Nueva Cita</a>
        <a routerLink="profile" routerLinkActive="active">👤 Mi Perfil</a>
      </nav>

      <!-- Aquí se cargarán las rutas hijas -->
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .content { padding: 1rem; }
    .menu { margin: 1rem 0; display: flex; gap: 1rem; }
    .menu a { text-decoration: none; color: #007bff; }
    .menu a.active { font-weight: bold; text-decoration: underline; }
  `]
})
export class PatientDashboardComponent {
  constructor(public auth: AuthService) { }
}
