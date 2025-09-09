import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 👇 Define una interfaz para el User (ajústala a tu DB)
export interface User {
    id: number;
    name: string;
    firstLastName?: string;
    secondLastName?: string;
    username: string;
    email: string;
    role: string;
    state: number;
    created_at: string;
    updated_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private apiUrl = 'http://localhost:3000/api/admin/users'; // 👈 Ajusta si usas otro puerto

    constructor(private http: HttpClient) { }

    // 📌 Obtener todos los usuarios
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    // 📌 Obtener un usuario por ID
    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    // 📌 Crear usuario
    createUser(user: Partial<User>): Observable<any> {
        return this.http.post(this.apiUrl, user);
    }

    // 📌 Actualizar usuario
    updateUser(id: number, user: Partial<User>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, user);
    }

    // 📌 Cambiar estado (activar/desactivar)
    toggleUserState(id: number, state: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/state`, { state });
    }
}
