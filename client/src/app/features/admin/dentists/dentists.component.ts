import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DentistsService, Dentist } from '../../../core/services/dentists.service';

@Component({
    selector: 'app-dentists',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <main class="content">
      <h2>👨‍⚕️ Gestión de Dentistas</h2>

      <!-- Botón para crear -->
      <button (click)="openForm()" class="btn btn-primary">➕ Nuevo Dentista</button>

      <!-- Tabla -->
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Especialidad</th>
            <th>Matrícula</th>
            <th>Experiencia</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let d of dentists">
            <td>{{ d.id }}</td>
            <td>{{ d.name }} {{ d.firstLastName }}</td>
            <td>{{ d.email }}</td>
            <td>{{ d.specialty }}</td>
            <td>{{ d.license_number }}</td>
            <td>{{ d.experience_years }} años</td>
            <td>{{ d.phone }}</td>
            <td>
              <span [class.active]="d.state" [class.inactive]="!d.state">
                {{ d.state ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button (click)="editDentist(d)">✏️</button>
              <button (click)="toggleState(d)">🔄</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Formulario -->
      <div *ngIf="showForm" class="form-card">
        <h3>{{ editing ? 'Editar Dentista' : 'Nuevo Dentista' }}</h3>
        <form (ngSubmit)="saveDentist()">
          <label>Usuario (ID):</label>
          <input type="number" [(ngModel)]="form.user_id" name="user_id" required />

          <label>Especialidad (ID):</label>
          <input type="number" [(ngModel)]="form.specialty_id" name="specialty_id" required />

          <label>Matrícula Profesional:</label>
          <input type="text" [(ngModel)]="form.license_number" name="license_number" required />

          <label>Experiencia (años):</label>
          <input type="number" [(ngModel)]="form.experience_years" name="experience_years" />
            <br>
          <label>Teléfono:</label>
          <input type="text" [(ngModel)]="form.phone" name="phone" />

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
export class DentistsComponent implements OnInit {
    dentists: Dentist[] = [];
    showForm = false;
    editing = false;
    form: Partial<Dentist> = {};

    constructor(private dentistsService: DentistsService) { }

    ngOnInit() {
        this.loadDentists();
    }

    loadDentists() {
        this.dentistsService.getAll().subscribe({
            next: (data) => this.dentists = data,
            error: (err) => console.error('Error cargando dentistas', err)
        });
    }

    openForm() {
        this.showForm = true;
        this.editing = false;
        this.form = {};
    }

    editDentist(dentist: Dentist) {
        this.showForm = true;
        this.editing = true;
        this.form = { ...dentist };
    }

    saveDentist() {
        if (this.editing && this.form.id) {
            this.dentistsService.update(this.form.id, this.form).subscribe({
                next: () => { this.loadDentists(); this.cancel(); },
                error: (err) => console.error('Error editando dentista', err)
            });
        } else {
            this.dentistsService.create(this.form).subscribe({
                next: () => { this.loadDentists(); this.cancel(); },
                error: (err) => console.error('Error creando dentista', err)
            });
        }
    }

    toggleState(dentist: Dentist) {
        if (!dentist.id) return;
        const newState = dentist.state ? 0 : 1;
        this.dentistsService.toggleState(dentist.id, newState).subscribe({
            next: () => this.loadDentists(),
            error: (err) => console.error('Error cambiando estado', err)
        });
    }

    cancel() {
        this.showForm = false;
        this.form = {};
    }
}
