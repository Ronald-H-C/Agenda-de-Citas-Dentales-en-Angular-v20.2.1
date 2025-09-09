import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService, Appointment } from '../../../core/services/appointments.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="content">
      <h2>📅 Gestión de Citas</h2>

      <!-- Botón -->
      <button (click)="openForm()" class="btn btn-primary">➕ Nueva Cita</button>

      <!-- Tabla -->
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Dentista</th>
            <th>Consultorio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of appointments">
            <td>{{ a.id }}</td>
            <td>{{ a.patient_name || a.patient_id }}</td>
            <td>{{ a.dentist_name || a.dentist_id }}</td>
            <td>{{ a.office_name || a.office_id }}</td>
            <td>{{ a.appointment_date }}</td>
            <td>{{ a.appointment_time }}</td>
            <td>{{ a.reason }}</td>
            <td>
              <span [ngClass]="a.status">{{ a.status }}</span>
            </td>
            <td>
              <button (click)="editAppointment(a)">✏️</button>
              <button (click)="changeStatus(a, 'cancelled')">❌ Cancelar</button>
              <button (click)="changeStatus(a, 'confirmed')">✅ Confirmar</button>
              <button (click)="deleteAppointment(a.id)">🗑️ Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Formulario -->
      <div *ngIf="showForm" class="form-card">
        <h3>{{ editing ? 'Editar Cita' : 'Nueva Cita' }}</h3>
        <form (ngSubmit)="saveAppointment()">
          <label>Paciente (ID):</label>
          <input type="number" [(ngModel)]="form.patient_id" name="patient_id" required />

          <label>Dentista (ID):</label>
          <input type="number" [(ngModel)]="form.dentist_id" name="dentist_id" required />

          <label>Consultorio (ID):</label>
          <input type="number" [(ngModel)]="form.office_id" name="office_id" required />

          <label>Fecha:</label>
          <input type="date" [(ngModel)]="form.appointment_date" name="appointment_date" required />

          <label>Hora:</label>
          <input type="time" [(ngModel)]="form.appointment_time" name="appointment_time" required />

          <label>Motivo:</label>
          <textarea [(ngModel)]="form.reason" name="reason"></textarea>

          <div class="actions">
            <button type="submit" class="btn btn-success">💾 Guardar</button>
            <button type="button" (click)="cancel()" class="btn btn-secondary">❌ Cancelar</button>
          </div>
        </form>
      </div>
    </main>
  `,
  styles: [`
    .content { padding: 1rem; }
    .btn { margin: 0.25rem; padding: 0.4rem 0.8rem; border: none; cursor: pointer; border-radius: 5px; }
    .btn-primary { background: #007bff; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .table { width: 100%; margin-top: 1rem; border-collapse: collapse; }
    .table th, .table td { padding: 0.5rem; border: 1px solid #ccc; text-align: left; }
    .form-card { margin-top: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; background: #f8f9fa; }
    .actions { margin-top: 1rem; }
    .pending { color: orange; font-weight: bold; }
    .confirmed { color: green; font-weight: bold; }
    .completed { color: blue; font-weight: bold; }
    .cancelled { color: red; font-weight: bold; }
  `]
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  showForm = false;
  editing = false;
  form: any = {};

  constructor(private appointmentsService: AppointmentsService) { }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentsService.getAll().subscribe({
      next: (data) => this.appointments = data,
      error: (err) => console.error('Error cargando citas', err)
    });
  }

  openForm() {
    this.showForm = true;
    this.editing = false;
    this.form = {};
  }

  editAppointment(appointment: Appointment) {
    this.showForm = true;
    this.editing = true;
    this.form = { ...appointment };
  }

  saveAppointment() {
    if (this.editing && this.form.id) {
      this.appointmentsService.update(this.form.id, this.form).subscribe({
        next: () => { this.loadAppointments(); this.cancel(); },
        error: (err) => console.error('Error editando cita', err)
      });
    } else {
      this.appointmentsService.create(this.form).subscribe({
        next: () => { this.loadAppointments(); this.cancel(); },
        error: (err) => console.error('Error creando cita', err)
      });
    }
  }

  changeStatus(appointment: Appointment, status: string) {
    if (!appointment.id) return;
    this.appointmentsService.changeStatus(appointment.id, status).subscribe({
      next: () => this.loadAppointments(),
      error: (err) => console.error('Error cambiando estado de cita', err)
    });
  }

  deleteAppointment(id?: number) {
    if (!id) return;
    if (confirm('¿Seguro que quieres eliminar esta cita?')) {
      this.appointmentsService.delete(id).subscribe({
        next: () => this.loadAppointments(),
        error: (err) => console.error('Error eliminando cita', err)
      });
    }
  }

  cancel() {
    this.showForm = false;
    this.form = {};
  }
}
