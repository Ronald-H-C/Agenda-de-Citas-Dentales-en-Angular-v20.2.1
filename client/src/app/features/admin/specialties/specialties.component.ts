import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialtiesService, Specialty } from '../../../core/services/specialties.service';

@Component({
    selector: 'app-specialties',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <h2>Gestión de Especialidades</h2>

    <!-- Botón para abrir modal -->
    <button (click)="openForm()">➕ Nueva Especialidad</button>

    <!-- Tabla de especialidades -->
    <table border="1" width="100%" cellpadding="6">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let s of specialties">
          <td>{{ s.name }}</td>
          <td>{{ s.description }}</td>
          <td>
            <span [style.color]="s.state ? 'green' : 'red'">
              {{ s.state ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            <button (click)="editSpecialty(s)">✏️ Editar</button>
            <button (click)="toggleState(s)">
              {{ s.state ? '🚫 Desactivar' : '✅ Activar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div *ngIf="showForm" class="modal">
      <div class="modal-content">
        <h3>{{ editingSpecialty?.id ? 'Editar' : 'Nueva' }} Especialidad</h3>

        <form (ngSubmit)="saveSpecialty()">
          <label>
            Nombre:
            <input [(ngModel)]="editingSpecialty.name" name="name" required />
          </label>
          <label>
            Descripción:
            <textarea [(ngModel)]="editingSpecialty.description" name="description"></textarea>
          </label>

          <div class="modal-actions">
            <button type="submit">💾 Guardar</button>
            <button type="button" (click)="closeForm()">❌ Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    table { margin-top: 1rem; border-collapse: collapse; }
    th, td { text-align: left; }
    button { margin: 0 4px; }
    .modal {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex; justify-content: center; align-items: center;
    }
    .modal-content {
      background: #fff; padding: 1rem; border-radius: 6px; min-width: 300px;
    }
    .modal-actions { margin-top: 1rem; display: flex; gap: .5rem; }
  `]
})
export class SpecialtiesComponent implements OnInit {
    specialties: Specialty[] = [];
    showForm = false;
    editingSpecialty: any = {};

    constructor(private specialtiesService: SpecialtiesService) { }

    ngOnInit() {
        this.loadSpecialties();
    }

    loadSpecialties() {
        this.specialtiesService.getSpecialties().subscribe({
            next: (res) => (this.specialties = res),
            error: (err) => console.error('Error cargando especialidades:', err)
        });
    }

    openForm() {
        this.editingSpecialty = {};
        this.showForm = true;
    }

    editSpecialty(specialty: Specialty) {
        this.editingSpecialty = { ...specialty };
        this.showForm = true;
    }

    saveSpecialty() {
        if (this.editingSpecialty.id) {
            this.specialtiesService.updateSpecialty(this.editingSpecialty.id, this.editingSpecialty).subscribe({
                next: () => {
                    this.loadSpecialties();
                    this.closeForm();
                },
                error: (err) => console.error('Error actualizando especialidad:', err)
            });
        } else {
            this.specialtiesService.createSpecialty(this.editingSpecialty).subscribe({
                next: () => {
                    this.loadSpecialties();
                    this.closeForm();
                },
                error: (err) => console.error('Error creando especialidad:', err)
            });
        }
    }

    toggleState(specialty: Specialty) {
        const newState = specialty.state ? 0 : 1;
        this.specialtiesService.toggleSpecialtyState(specialty.id, newState).subscribe({
            next: () => this.loadSpecialties(),
            error: (err) => console.error('Error cambiando estado:', err)
        });
    }

    closeForm() {
        this.showForm = false;
        this.editingSpecialty = {};
    }
}
