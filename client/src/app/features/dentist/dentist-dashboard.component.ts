// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../core/services/auth';

// @Component({
//     selector: 'app-dentist-dashboard',
//     standalone: true,
//     imports: [CommonModule],
//     template: `
//     <main class="content">
//       <h2>Panel de Dentista</h2>
//       <p>Bienvenido {{ auth.currentUser()?.name }} ({{ auth.currentUser()?.role }})</p>
//     </main>
//   `,
//     styles: [`.content { padding: 1rem; }`]
// })
// export class DentistDashboardComponent {
//     constructor(public auth: AuthService) { }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dentist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <main class="content">
      <h2>Panel de Dentista</h2>
      <p>Bienvenido {{ auth.currentUser()?.name }} ({{ auth.currentUser()?.role }})</p>

      <!-- 📌 Menú de navegación interno -->
      <nav class="menu">
        <a routerLink="appointments" routerLinkActive="active">Mis Citas</a>
        <a routerLink="schedules" routerLinkActive="active">Mis Horarios</a>
      </nav>

      <!-- 📌 Aquí se cargan los submódulos -->
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .content { padding: 1rem; }
    .menu { margin: 1rem 0; display: flex; gap: 1rem; }
    .active { font-weight: bold; color: darkblue; }
  `]
})
export class DentistDashboardComponent {
  constructor(public auth: AuthService) { }
}
