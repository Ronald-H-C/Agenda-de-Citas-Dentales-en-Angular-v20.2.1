import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
    id?: number;
    patient_id: number;
    dentist_id: number;
    office_id: number;
    appointment_date: string; // formato YYYY-MM-DD
    appointment_time: string; // formato HH:mm
    reason?: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';

    // 👇 Opcionales si el backend devuelve joins
    patient_name?: string;
    dentist_name?: string;
    office_name?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
    private apiUrl = 'http://localhost:3000/api/admin/appointments';

    constructor(private http: HttpClient) { }

    // 📌 Obtener todas las citas
    getAll(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(this.apiUrl);
    }

    // 📌 Obtener cita por ID
    getById(id: number): Observable<Appointment> {
        return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
    }

    // 📌 Crear nueva cita
    create(payload: Partial<Appointment>): Observable<any> {
        return this.http.post(this.apiUrl, payload);
    }

    // 📌 Actualizar cita
    update(id: number, payload: Partial<Appointment>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, payload);
    }

    // 📌 Cambiar estado (cancelar, confirmar, etc.)
    changeStatus(id: number, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
    }

    // 📌 Eliminar cita
    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
