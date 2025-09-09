import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DentistSchedule {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    office_id?: number;
    office_name?: string;
}

@Injectable({ providedIn: 'root' })
export class DentistSchedulesService {
    private apiUrl = '/api/dentist/schedules';

    constructor(private http: HttpClient) { }

    // Obtener horarios del dentista logueado
    getMySchedules(): Observable<DentistSchedule[]> {
        return this.http.get<DentistSchedule[]>(this.apiUrl);
    }

    // (Opcional) Crear un nuevo horario
    createSchedule(schedule: Partial<DentistSchedule>): Observable<any> {
        return this.http.post(this.apiUrl, schedule);
    }

    // (Opcional) Eliminar un horario
    deleteSchedule(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
