import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchedulesService, Schedule } from '../../../core/services/schedules.service';

@Component({
    selector: 'app-schedules',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <main class="content">
      <h2>📅 Gestión de Horarios</h2>

      <!-- Botón para crear -->
      <button (click)="openForm()" class="btn btn-primary">➕ Nuevo Horario</button>

      <!-- Tabla -->
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dentista</th>
            <th>Día</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of schedules">
            <td>{{ s.id }}</td>
            <td>{{ s.dentist_name }}</td>
            <td>{{ s.day_of_week }}</td>
            <td>{{ s.start_time }}</td>
            <td>{{ s.end_time }}</td>
            <td>
              <span [class.active]="s.state" [class.inactive]="!s.state">
                {{ s.state ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button (click)="editSchedule(s)">✏️</button>
              <button (click)="toggleState(s)">🔄</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Formulario -->
      <div *ngIf="showForm" class="form-card">
        <h3>{{ editing ? 'Editar Horario' : 'Nuevo Horario' }}</h3>
        <form (ngSubmit)="saveSchedule()">
          <label>Dentista (ID):</label>
          <input type="number" [(ngModel)]="form.dentist_id" name="dentist_id" required />

          <label>Día de la Semana:</label>
          <select [(ngModel)]="form.day_of_week" name="day_of_week" required>
            <option *ngFor="let d of days" [value]="d">{{ d }}</option>
          </select>

          <label>Hora de Inicio:</label>
          <input type="time" [(ngModel)]="form.start_time" name="start_time" required />

          <label>Hora de Fin:</label>
          <input type="time" [(ngModel)]="form.end_time" name="end_time" required />

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
    .active { color: green; font-weight: bold; }
    .inactive { color: red; font-weight: bold; }
  `]
})
export class SchedulesComponent implements OnInit {
    schedules: Schedule[] = [];
    showForm = false;
    editing = false;
    form: Partial<Schedule> = {};

    days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    constructor(private schedulesService: SchedulesService) { }

    ngOnInit() {
        this.loadSchedules();
    }

    loadSchedules() {
        this.schedulesService.getAll().subscribe({
            next: (data) => this.schedules = data,
            error: (err) => console.error('Error cargando horarios', err)
        });
    }

    openForm() {
        this.showForm = true;
        this.editing = false;
        this.form = {};
    }

    editSchedule(schedule: Schedule) {
        this.showForm = true;
        this.editing = true;
        this.form = { ...schedule };
    }

    saveSchedule() {
        if (this.editing && this.form.id) {
            this.schedulesService.update(this.form.id, this.form).subscribe({
                next: () => { this.loadSchedules(); this.cancel(); },
                error: (err) => console.error('Error editando horario', err)
            });
        } else {
            this.schedulesService.create(this.form).subscribe({
                next: () => { this.loadSchedules(); this.cancel(); },
                error: (err) => console.error('Error creando horario', err)
            });
        }
    }

    toggleState(schedule: Schedule) {
        if (!schedule.id) return;
        const newState = schedule.state ? 0 : 1;
        this.schedulesService.toggleState(schedule.id, newState).subscribe({
            next: () => this.loadSchedules(),
            error: (err) => console.error('Error cambiando estado', err)
        });
    }

    cancel() {
        this.showForm = false;
        this.form = {};
    }
}
