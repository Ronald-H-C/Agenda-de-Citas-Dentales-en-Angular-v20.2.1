import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Schedule {
    id?: number;
    dentist_id: number;
    day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    start_time: string;  // formato "HH:mm:ss"
    end_time: string;    // formato "HH:mm:ss"
    state?: number;

    // campos útiles de joins
    dentist_name?: string;
    specialty?: string;
}

@Injectable({ providedIn: 'root' })
export class SchedulesService {
    private apiUrl = 'http://localhost:3000/api/admin/schedules';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Schedule[]> {
        return this.http.get<Schedule[]>(this.apiUrl);
    }

    getById(id: number): Observable<Schedule> {
        return this.http.get<Schedule>(`${this.apiUrl}/${id}`);
    }

    create(payload: Partial<Schedule>): Observable<any> {
        return this.http.post(this.apiUrl, payload);
    }

    update(id: number, payload: Partial<Schedule>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, payload);
    }

    toggleState(id: number, state: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/state`, { state });
    }
}
