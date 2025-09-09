import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PatientProfile {
    id: number;
    name: string;
    firstLastName: string;
    email: string;
    phone?: string;
    role: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private apiUrl = 'http://localhost:3000/api/patient/profile';

    constructor(private http: HttpClient) { }

    // 📌 Obtener perfil del paciente autenticado
    getProfile(): Observable<PatientProfile> {
        return this.http.get<PatientProfile>(this.apiUrl);
    }

    // 📌 Actualizar perfil
    updateProfile(profile: Partial<PatientProfile>): Observable<any> {
        return this.http.put(this.apiUrl, profile);
    }
}
