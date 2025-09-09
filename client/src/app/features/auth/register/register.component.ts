import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="register-container">
      <h2>Crear cuenta</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input formControlName="name" placeholder="Nombre" />
        <input formControlName="firstLastName" placeholder="Primer apellido" />
        <input formControlName="secondLastName" placeholder="Segundo apellido" />
        <input formControlName="username" placeholder="Usuario" />
        <input formControlName="email" type="email" placeholder="Correo" />
        <input formControlName="password" type="password" placeholder="Contraseña" />

        <button type="submit" [disabled]="form.invalid">Registrarse</button>
      </form>

      <p>
        ¿Ya tienes cuenta?
        <a routerLink="/login">Inicia sesión</a>
      </p>
    </div>
  `,
    styles: [`
    .register-container {
      max-width: 400px;
      margin: auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    input {
      padding: .75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
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
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    form = this.fb.group({
        name: ['', Validators.required],
        firstLastName: [''],
        secondLastName: [''],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    onSubmit() {
        if (this.form.invalid) return;

        const { name, firstLastName, secondLastName, username, email, password } = this.form.value;

        // Construimos el objeto asegurando que no haya undefined
        const payload = {
            name: name!,
            firstLastName: firstLastName || '',
            secondLastName: secondLastName || '',
            username: username!,
            email: email!,
            password: password!
        };

        this.auth.register(payload).subscribe({
            next: () => {
                alert('✅ Usuario registrado con éxito. Ahora puedes iniciar sesión.');
                this.router.navigate(['/login']);
            },
            error: err => {
                console.error(err);
                alert('❌ Error al registrar usuario');
            }
        });
    }
}
