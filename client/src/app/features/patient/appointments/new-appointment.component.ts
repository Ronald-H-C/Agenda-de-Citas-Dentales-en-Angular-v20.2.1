import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NewAppointmentService, Appointment } from './new-appointments.service';

@Component({
  selector: 'app-new-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="form-container">
      <h3>➕ Nueva Cita</h3>

      <form (ngSubmit)="createAppointment()" #apptForm="ngForm">
        <label>
          Fecha:
          <input type="date" [(ngModel)]="appointment.appointment_date" name="date" required />
        </label>

        <label>
          Hora:
          <input type="time" [(ngModel)]="appointment.appointment_time" name="time" required />
        </label>

        <label>
          Dentista:
          <select [(ngModel)]="appointment.dentist_id" name="dentist" required>
            <option *ngFor="let d of dentists" [value]="d.id">
              {{ d.name }} {{ d.firstLastName }}
            </option>
          </select>
        </label>

        <label>
          Oficina:
          <select [(ngModel)]="appointment.office_id" name="office" required>
            <option *ngFor="let o of offices" [value]="o.id">
              {{ o.name }}
            </option>
          </select>
        </label>

        <label>
          Motivo:
          <textarea [(ngModel)]="appointment.reason" name="reason" required></textarea>
        </label>

        <button type="submit" [disabled]="apptForm.invalid">Guardar</button>
      </form>

      <p *ngIf="message" class="msg">{{ message }}</p>
    </section>
  `,
  styles: [`
    .form-container { max-width: 500px; margin: 1rem auto; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
    form { display: flex; flex-direction: column; gap: 1rem; }
    label { display: flex; flex-direction: column; font-weight: bold; }
    input, select, textarea { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button[disabled] { background: #999; cursor: not-allowed; }
    .msg { margin-top: 1rem; font-weight: bold; }
  `]
})
export class NewAppointmentComponent implements OnInit {
  appointment: Appointment = {
    appointment_date: '',
    appointment_time: '',
    dentist_id: 0,
    office_id: 0,
    reason: ''
  };

  dentists: any[] = [];
  offices: any[] = [];
  message: string = '';

  constructor(
    private service: NewAppointmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.service.getDentists().subscribe((d: any[]) => this.dentists = d);
    this.service.getOffices().subscribe((o: any[]) => this.offices = o);
  }

  createAppointment(): void {
    this.service.createAppointment(this.appointment).subscribe({
      next: () => {
        this.message = '✅ Cita creada exitosamente';
        setTimeout(() => this.router.navigate(['/patient/appointments']), 1500);
      },
      error: (err: any) => {
        console.error(err);
        this.message = '❌ Error al crear la cita';
      }
    });
  }
}
