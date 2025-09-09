import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 👇 Interfaz de Office según tu DB
export interface Office {
    id?: number;
    name: string;
    location?: string;
    description?: string;
    state?: number;
}

@Injectable({
    providedIn: 'root'
})
export class OfficesService {
    private apiUrl = 'http://localhost:3000/api/admin/offices'; // 👈 Ruta backend

    constructor(private http: HttpClient) { }

    // 📌 Obtener todas las oficinas
    getAll(): Observable<Office[]> {
        return this.http.get<Office[]>(this.apiUrl);
    }

    // 📌 Obtener una oficina por ID
    getById(id: number): Observable<Office> {
        return this.http.get<Office>(`${this.apiUrl}/${id}`);
    }

    // 📌 Crear oficina
    create(payload: Partial<Office>): Observable<any> {
        return this.http.post(this.apiUrl, payload);
    }

    // 📌 Actualizar oficina
    update(id: number, payload: Partial<Office>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, payload);
    }

    // 📌 Cambiar estado (activar/desactivar)
    toggleState(id: number, state: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/state`, { state });
    }
}
