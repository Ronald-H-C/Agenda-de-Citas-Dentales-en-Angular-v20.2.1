// import { Injectable, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { tap } from 'rxjs';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
// }

// interface LoginResponse {
//   token: string;
//   user: User;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000/api/users';

//   // ✅ Usamos Signals (Angular 16+) para estado reactivo
//   currentUser = signal<User | null>(null);
//   token = signal<string | null>(null);

//   constructor(private http: HttpClient) {
//     // Si hay token en localStorage, lo cargamos
//     const savedToken = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
//     if (savedToken && savedUser) {
//       this.token.set(savedToken);
//       this.currentUser.set(JSON.parse(savedUser));
//     }
//   }

//   login(email: string, password: string) {
//     return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
//       tap(res => {
//         this.token.set(res.token);
//         this.currentUser.set(res.user);
//         localStorage.setItem('token', res.token);
//         localStorage.setItem('user', JSON.stringify(res.user));
//       })
//     );
//   }

//   register(data: {
//     name: string;
//     firstLastName: string;
//     secondLastName?: string;
//     username: string;
//     email: string;
//     password: string;
//   }) {
//     return this.http.post(`${this.apiUrl}/register`, data);
//   }

//   logout() {
//     this.token.set(null);
//     this.currentUser.set(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }

//   isLoggedIn() {
//     return this.token() !== null;
//   }
// }
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';

  // ✅ Estado reactivo con Signals
  private _currentUser = signal<User | null>(null);
  private _token = signal<string | null>(null);

  constructor(private http: HttpClient) {
    // Recuperar sesión guardada en localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      this._token.set(savedToken);
      this._currentUser.set(JSON.parse(savedUser));
    }
  }

  // 👉 Exponemos solo getters públicos
  currentUser = () => this._currentUser();
  token = () => this._token();

  // 🔑 Iniciar sesión
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        this._token.set(res.token);
        this._currentUser.set(res.user);

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  // 📝 Registrar usuario
  register(data: {
    name: string;
    firstLastName: string;
    secondLastName?: string;
    username: string;
    email: string;
    password: string;
  }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // 🚪 Cerrar sesión
  logout() {
    this._token.set(null);
    this._currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // ✅ Verificar si está logueado
  isLoggedIn() {
    return this._token() !== null;
  }
}
