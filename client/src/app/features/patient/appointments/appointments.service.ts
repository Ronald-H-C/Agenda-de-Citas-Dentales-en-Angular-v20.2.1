
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
    id?: number;
    patient_id: number;
    dentist_id: number;
    office_id: number;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';

    // Datos opcionales desde joins
    dentist_name?: string;
    office_name?: string;
}

@Injectable({ providedIn: 'root' })
export class PatientAppointmentsService {
    private apiUrl = 'http://localhost:3000/api/patient/appointments';

    constructor(private http: HttpClient) { }

    // 📌 Obtener las citas del paciente autenticado
    getMyAppointments(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(this.apiUrl);
    }
}
