import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DentistAppointmentsService, DentistAppointment } from './appointments.service';

@Component({
    selector: 'app-dentist-appointments',
    standalone: true,
    imports: [CommonModule],
    template: `
    <main class="content">
      <h2>📅 Mis Citas</h2>

      <!-- Mensajes de estado -->
      <p *ngIf="loading">Cargando citas...</p>
      <p *ngIf="error" class="error">{{ error }}</p>
      <p *ngIf="!loading && !error && appointments.length === 0">No tienes citas programadas.</p>

      <!-- Tabla de citas -->
      <table *ngIf="appointments.length > 0" class="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>Motivo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of appointments">
            <td>{{ a.appointment_date }}</td>
            <td>{{ a.appointment_time }}</td>
            <td>{{ a.patient_name }}</td>
            <td>{{ a.reason || '-' }}</td>
            <td>
              <span [ngClass]="a.status">{{ a.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
    styles: [`
    .content { padding: 1rem; }
    .error { color: red; font-weight: bold; }
    .table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    .table th, .table td { padding: 0.5rem; border: 1px solid #ccc; text-align: left; }
    .pending { color: orange; font-weight: bold; }
    .confirmed { color: green; font-weight: bold; }
    .completed { color: blue; font-weight: bold; }
    .cancelled { color: red; font-weight: bold; }
  `]
})
export class DentistAppointmentsComponent implements OnInit {
    appointments: DentistAppointment[] = [];
    loading = false;
    error: string | null = null;

    constructor(private service: DentistAppointmentsService) { }

    ngOnInit(): void {
        this.loadAppointments();
    }

    loadAppointments(): void {
        this.loading = true;
        this.error = null;

        this.service.getMyAppointments().subscribe({
            next: (data) => {
                this.appointments = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('❌ Error cargando citas del dentista', err);
                this.error = 'No se pudieron cargar las citas.';
                this.loading = false;
            }
        });
    }
}
