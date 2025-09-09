import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Reutilizamos la misma interfaz para asegurar tipado correcto
export interface Appointment {
    id?: number;
    patient_id?: number; // se setea en backend a partir del token
    dentist_id: number;
    office_id: number;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

@Injectable({ providedIn: 'root' })
export class NewAppointmentService {
    private apiUrl = 'http://localhost:3000/api/patient/appointments';

    constructor(private http: HttpClient) { }

    // 📌 Crear nueva cita
    createAppointment(data: Appointment): Observable<Appointment> {
        return this.http.post<Appointment>(this.apiUrl, data);
    }

    // 📌 Obtener todos los dentistas (para selector)
    getDentists(): Observable<any[]> {
        return this.http.get<any[]>('http://localhost:3000/api/admin/dentists');
    }

    // 📌 Obtener todas las oficinas (para selector)
    getOffices(): Observable<any[]> {
        return this.http.get<any[]>('http://localhost:3000/api/admin/offices');
    }
}
