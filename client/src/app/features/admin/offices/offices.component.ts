import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfficesService, Office } from '../../../core/services/offices.service';

@Component({
    selector: 'app-offices',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <main class="content">
      <h2>🏢 Gestión de Consultorios</h2>

      <!-- Botón para crear -->
      <button (click)="openForm()" class="btn btn-primary">➕ Nuevo Consultorio</button>

      <!-- Tabla -->
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let o of offices">
            <td>{{ o.id }}</td>
            <td>{{ o.name }}</td>
            <td>{{ o.location }}</td>
            <td>{{ o.description }}</td>
            <td>
              <span [class.active]="o.state" [class.inactive]="!o.state">
                {{ o.state ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button (click)="editOffice(o)">✏️</button>
              <button (click)="toggleState(o)">🔄</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Formulario -->
      <div *ngIf="showForm" class="form-card">
        <h3>{{ editing ? 'Editar Consultorio' : 'Nuevo Consultorio' }}</h3>
        <form (ngSubmit)="saveOffice()">
          <label>Nombre:</label>
          <input type="text" [(ngModel)]="form.name" name="name" required />

          <label>Ubicación:</label>
          <input type="text" [(ngModel)]="form.location" name="location" />

          <label>Descripción:</label>
          <textarea [(ngModel)]="form.description" name="description"></textarea>

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
export class OfficesComponent implements OnInit {
    offices: Office[] = [];
    showForm = false;
    editing = false;
    form: Partial<Office> = {};

    constructor(private officesService: OfficesService) { }

    ngOnInit() {
        this.loadOffices();
    }

    loadOffices() {
        this.officesService.getAll().subscribe({
            next: (data) => this.offices = data,
            error: (err) => console.error('Error cargando oficinas', err)
        });
    }

    openForm() {
        this.showForm = true;
        this.editing = false;
        this.form = {};
    }

    editOffice(office: Office) {
        this.showForm = true;
        this.editing = true;
        this.form = { ...office };
    }

    saveOffice() {
        if (this.editing && this.form.id) {
            this.officesService.update(this.form.id, this.form).subscribe({
                next: () => { this.loadOffices(); this.cancel(); },
                error: (err) => console.error('Error editando oficina', err)
            });
        } else {
            this.officesService.create(this.form).subscribe({
                next: () => { this.loadOffices(); this.cancel(); },
                error: (err) => console.error('Error creando oficina', err)
            });
        }
    }

    toggleState(office: Office) {
        if (!office.id) return;
        this.officesService.toggleState(office.id, office.state ? 0 : 1).subscribe({
            next: () => this.loadOffices(),
            error: (err) => console.error('Error cambiando estado', err)
        });
    }

    cancel() {
        this.showForm = false;
        this.form = {};
    }
}
