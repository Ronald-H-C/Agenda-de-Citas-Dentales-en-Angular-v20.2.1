// import { Component, inject } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../../core/services/auth';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css'],
// })
// export class LoginComponent {
//   private fb = inject(FormBuilder);
//   private auth = inject(AuthService);

//   error: string | null = null;

//   form = this.fb.group({
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', Validators.required],
//   });

//   submit() {
//     if (this.form.invalid) return;

//     const { email, password } = this.form.value;

//     // Aseguramos que email y password no sean undefined
//     const loginData = {
//       email: email!,
//       password: password!,
//     };

//     this.auth.login(loginData).subscribe({
//       next: (res) => {
//         console.log('✅ Login exitoso:', res);
//         localStorage.setItem('token', res.token);
//         this.error = null;
//       },
//       error: (err) => {
//         console.error('❌ Error de login:', err);
//         this.error = 'Credenciales inválidas';
//       },
//     });
//   }
// }
