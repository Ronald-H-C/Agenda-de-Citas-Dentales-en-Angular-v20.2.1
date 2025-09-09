import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <h2>Iniciar Sesión</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Email</label>
        <input type="email" formControlName="email" placeholder="tu@email.com" />
        <div *ngIf="form.controls.email.invalid && form.controls.email.touched" class="error">
          El email es requerido
        </div>

        <label>Contraseña</label>
        <input type="password" formControlName="password" placeholder="••••••••" />
        <div *ngIf="form.controls.password.invalid && form.controls.password.touched" class="error">
          La contraseña es requerida
        </div>

        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>

      <p class="register-link">
        ¿No tienes cuenta?
        <a routerLink="/register">Regístrate aquí</a>
      </p>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      text-align: center;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    input {
      padding: 0.5rem;
      font-size: 1rem;
    }
    button {
      padding: .75rem;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-weight: bold;
    }
    button:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }
    p {
      margin-top: 1rem;
      text-align: center;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: (res) => {  // ✅ res está tipado como LoginResponse
        this.loading = false;

        const role = res.user.role;

        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'dentist') {
          this.router.navigate(['/dentist']);
        } else {
          this.router.navigate(['/patient']);
        }
      },
      error: (err) => {
        this.loading = false;
        alert('Error en las credenciales: ' + (err.error?.message || 'Intenta de nuevo'));
      }
    });

  }

}
