import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DentistAppointment {
    id: number;
    appointment_date: string; // YYYY-MM-DD
    appointment_time: string; // HH:mm
    reason?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    patient_name: string;
}

@Injectable({ providedIn: 'root' })
export class DentistAppointmentsService {
    private apiUrl = 'http://localhost:3000/api/dentist/appointments'; // 👈 URL backend

    constructor(private http: HttpClient) { }

    // 📌 Obtener todas las citas del dentista autenticado
    getMyAppointments(): Observable<DentistAppointment[]> {
        return this.http.get<DentistAppointment[]>(this.apiUrl);
    }
}
