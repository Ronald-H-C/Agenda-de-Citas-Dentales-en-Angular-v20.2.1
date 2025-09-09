import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="content">
      <h2>Panel de Administración</h2>
      <p>Bienvenido {{ auth.currentUser()?.name }} ({{ auth.currentUser()?.role }})</p>

      <div class="cards">
        <div class="card" routerLink="/admin/users">
          <h3>👥 Gestionar Usuarios</h3>
          <p>Ver, crear, actualizar y desactivar usuarios.</p>
        </div>
        <div class="card" routerLink="/admin/specialties">
           <h3>🏷️ Gestionar Especialidades</h3>
            <p>Agregar, editar o desactivar especialidades de odontología.</p>
        </div>
        <div class="card" routerLink="/admin/dentists">
          <h3>🦷 Gestionar Dentistas</h3>
          <p>Registrar dentistas, asignar especialidades y gestionar su información.</p>
        </div>
        <div class="card" routerLink="/admin/offices">
          <h3>🏥 Gestionar Consultorios</h3>
          <p>Registrar y administrar consultorios disponibles.</p>
        </div>
        <div class="card" routerLink="/admin/schedules">
          <h3>⏰ Gestionar Horarios</h3>
          <p>Configurar los horarios de atención de cada dentista.</p>
        </div>
        <div class="card" routerLink="/admin/appointments">
          <h3>📅 Gestionar Citas</h3>
          <p>Ver, confirmar o cancelar citas de todos los pacientes.</p>
        </div>

      </div>
    </main>
  `,
  styles: [`
    .content { padding: 1rem; }
    .cards {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .card {
      flex: 1;
      padding: 1rem;
      border-radius: 8px;
      background: #f8f9fa;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
      background: #e9ecef;
    }
    h3 { margin: 0 0 0.5rem 0; }
  `]
})
export class AdminDashboardComponent {
  constructor(public auth: AuthService) { }
}
