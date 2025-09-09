import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dentist {
    id?: number;
    user_id: number;
    specialty_id: number;
    license_number: string;
    experience_years?: number;
    phone?: string;
    state?: number;

    // campos útiles traídos desde JOIN (opcionales)
    name?: string;
    firstLastName?: string;
    email?: string;
    specialty?: string;
}

@Injectable({ providedIn: 'root' })
export class DentistsService {
    private apiUrl = 'http://localhost:3000/api/admin/dentists'; // 👈 endpoint correcto

    constructor(private http: HttpClient) { }

    getAll(): Observable<Dentist[]> {
        return this.http.get<Dentist[]>(this.apiUrl);
    }

    getById(id: number): Observable<Dentist> {
        return this.http.get<Dentist>(`${this.apiUrl}/${id}`);
    }

    create(payload: Partial<Dentist>): Observable<any> {
        return this.http.post(this.apiUrl, payload);
    }

    update(id: number, payload: Partial<Dentist>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, payload);
    }

    toggleState(id: number, state: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/state`, { state });
    }
}
