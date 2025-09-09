import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Specialty {
    id: number;
    name: string;
    description?: string;
    state: number;
}

@Injectable({ providedIn: 'root' })
export class SpecialtiesService {
    private apiUrl = 'http://localhost:3000/api/admin/specialties';

    constructor(private http: HttpClient) { }

    getSpecialties(): Observable<Specialty[]> {
        return this.http.get<Specialty[]>(this.apiUrl);
    }

    createSpecialty(data: Partial<Specialty>): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    updateSpecialty(id: number, data: Partial<Specialty>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    toggleSpecialtyState(id: number, state: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/state`, { state });
    }
}
