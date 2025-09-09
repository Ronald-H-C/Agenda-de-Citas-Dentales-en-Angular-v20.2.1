import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, PatientProfile } from './profile.service';

@Component({
    selector: 'app-patient-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <section class="profile-container" *ngIf="profile">
      <h3>👤 Mi Perfil</h3>

      <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
        <label>
          Nombre:
          <input type="text" [(ngModel)]="profile.name" name="name" required />
        </label>

        <label>
          Apellido:
          <input type="text" [(ngModel)]="profile.firstLastName" name="lastName" required />
        </label>

        <label>
          Email:
          <input type="email" [(ngModel)]="profile.email" name="email" required />
        </label>

        <label>
          Teléfono:
          <input type="text" [(ngModel)]="profile.phone" name="phone" />
        </label>

        <button type="submit" [disabled]="profileForm.invalid">💾 Guardar</button>
      </form>

      <p *ngIf="message" class="msg">{{ message }}</p>
    </section>
  `,
    styles: [`
    .profile-container { max-width: 500px; margin: 1rem auto; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
    form { display: flex; flex-direction: column; gap: 1rem; }
    label { display: flex; flex-direction: column; font-weight: bold; }
    input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 0.5rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button[disabled] { background: #999; cursor: not-allowed; }
    .msg { margin-top: 1rem; font-weight: bold; }
  `]
})
export class PatientProfileComponent implements OnInit {
    profile: PatientProfile | null = null;
    message: string = '';

    constructor(private service: ProfileService) { }

    ngOnInit(): void {
        this.service.getProfile().subscribe({
            next: (data) => this.profile = data,
            error: (err) => console.error('Error cargando perfil:', err)
        });
    }

    updateProfile(): void {
        if (!this.profile) return;

        this.service.updateProfile(this.profile).subscribe({
            next: () => this.message = '✅ Perfil actualizado correctamente',
            error: (err) => {
                console.error('Error al actualizar perfil:', err);
                this.message = '❌ No se pudo actualizar el perfil';
            }
        });
    }
}
