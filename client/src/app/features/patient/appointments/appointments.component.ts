import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientAppointmentsService, Appointment } from './appointments.service';

@Component({
    selector: 'app-patient-appointments',
    standalone: true,
    imports: [CommonModule],
    template: `
    <main class="content">
      <h3>📅 Mis Citas</h3>

      <table class="table" *ngIf="appointments.length > 0; else noData">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Dentista</th>
            <th>Consultorio</th>
            <th>Motivo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of appointments">
            <td>{{ a.appointment_date }}</td>
            <td>{{ a.appointment_time }}</td>
            <td>{{ a.dentist_name }}</td>
            <td>{{ a.office_name }}</td>
            <td>{{ a.reason }}</td>
            <td>
              <span [ngClass]="a.status">{{ a.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #noData>
        <p>No tienes citas registradas.</p>
      </ng-template>
    </main>
  `,
    styles: [`
    .content { padding: 1rem; }
    .table { width: 100%; margin-top: 1rem; border-collapse: collapse; }
    .table th, .table td { padding: 0.5rem; border: 1px solid #ccc; text-align: left; }
    .pending { color: orange; font-weight: bold; }
    .confirmed { color: green; font-weight: bold; }
    .completed { color: blue; font-weight: bold; }
    .cancelled { color: red; font-weight: bold; }
  `]
})
export class PatientAppointmentsComponent implements OnInit {
    appointments: Appointment[] = [];

    constructor(private service: PatientAppointmentsService) { }

    ngOnInit(): void {
        this.loadAppointments();
    }

    loadAppointments() {
        this.service.getMyAppointments().subscribe({
            next: (data) => this.appointments = data,
            error: (err) => console.error('Error cargando citas del paciente', err)
        });
    }
}
