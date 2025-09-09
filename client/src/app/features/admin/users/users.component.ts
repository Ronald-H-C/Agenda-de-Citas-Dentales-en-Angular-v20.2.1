import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../../../core/services/users.service';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <h2>Gestión de Usuarios</h2>

    <!-- Botón para abrir modal de nuevo usuario -->
    <button (click)="openForm()">➕ Nuevo Usuario</button>

    <!-- Tabla de usuarios -->
    <table border="1" width="100%" cellpadding="6">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>Usuario</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let u of users">
          <td>{{ u.name }}</td>
          <td>{{ u.firstLastName }} {{ u.secondLastName }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.role }}</td>
          <td>
            <span [style.color]="u.state ? 'green' : 'red'">
              {{ u.state ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            <button (click)="editUser(u)">✏️ Editar</button>
            <button (click)="toggleState(u)">
              {{ u.state ? '🚫 Desactivar' : '✅ Activar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para crear/editar usuario -->
    <div *ngIf="showForm" class="modal">
      <div class="modal-content">
        <h3>{{ editingUser?.id ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>

        <form (ngSubmit)="saveUser()">
          <label>
            Nombre:
            <input [(ngModel)]="editingUser.name" name="name" required />
          </label>
          <label>
            Apellido Paterno:
            <input [(ngModel)]="editingUser.firstLastName" name="firstLastName" />
          </label>
          <label>
            Apellido Materno:
            <input [(ngModel)]="editingUser.secondLastName" name="secondLastName" />
          </label>
          <label>
            Usuario:
            <input [(ngModel)]="editingUser.username" name="username" required />
          </label>
          <label>
            Email:
            <input [(ngModel)]="editingUser.email" name="email" type="email" required />
          </label>
          <label>
            Rol:
            <select [(ngModel)]="editingUser.role" name="role" required>
              <option value="admin">Admin</option>
              <option value="dentist">Dentista</option>
              <option value="patient">Paciente</option>
            </select>
          </label>
          <label *ngIf="!editingUser.id">
            Contraseña:
            <input [(ngModel)]="editingUser.password" name="password" type="password" required />
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
    th, td { text-align: left; padding: .3rem; }
    button { margin: 0 4px; }
    .modal {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex; justify-content: center; align-items: center;
    }
    .modal-content {
      background: #fff; padding: 1rem; border-radius: 6px; min-width: 320px;
    }
    .modal-content label {
      display: block; margin-bottom: .5rem;
    }
    .modal-actions { margin-top: 1rem; display: flex; gap: .5rem; }
  `]
})
export class UsersComponent implements OnInit {
    users: User[] = [];
    showForm = false;
    editingUser: any = {};

    constructor(private usersService: UsersService) { }

    ngOnInit() {
        this.loadUsers();
    }

    // Cargar todos los usuarios
    loadUsers() {
        this.usersService.getUsers().subscribe({
            next: (res) => (this.users = res),
            error: (err) => console.error('Error cargando usuarios:', err)
        });
    }

    // Abrir modal para nuevo usuario
    openForm() {
        this.editingUser = {};
        this.showForm = true;
    }

    // Abrir modal para editar
    editUser(user: User) {
        this.editingUser = { ...user };
        this.showForm = true;
    }

    // Guardar usuario (crear o editar)
    saveUser() {
        if (this.editingUser.id) {
            // actualizar
            this.usersService.updateUser(this.editingUser.id, this.editingUser).subscribe({
                next: () => {
                    this.loadUsers();
                    this.closeForm();
                },
                error: (err) => console.error('Error actualizando usuario:', err)
            });
        } else {
            // crear
            this.usersService.createUser(this.editingUser).subscribe({
                next: () => {
                    this.loadUsers();
                    this.closeForm();
                },
                error: (err) => console.error('Error creando usuario:', err)
            });
        }
    }

    // Cambiar estado (activar/desactivar)
    toggleState(user: User) {
        const newState = user.state ? 0 : 1;
        this.usersService.toggleUserState(user.id, newState).subscribe({
            next: () => this.loadUsers(),
            error: (err) => console.error('Error cambiando estado:', err)
        });
    }

    // Cerrar modal
    closeForm() {
        this.showForm = false;
        this.editingUser = {};
    }
}
