import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ProtectedLayoutComponent } from './features/layout/protected-layout.component';
import { PublicLayoutComponent } from './features/layout/public-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        component: ProtectedLayoutComponent,
        canMatch: [authGuard],
        children: [
            {
                path: 'admin',
                canMatch: [roleGuard(['admin'])], // 👈 Solo admin
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./features/admin/admin-dashboard.component')
                                .then(m => m.AdminDashboardComponent),
                    },
                    {
                        path: 'users',
                        loadComponent: () =>
                            import('./features/admin/users/users.component')
                                .then(m => m.UsersComponent),
                    },
                    { path: 'specialties', loadComponent: () => import('./features/admin/specialties/specialties.component').then(m => m.SpecialtiesComponent) },
                    { path: 'dentists', loadComponent: () => import('./features/admin/dentists/dentists.component').then(m => m.DentistsComponent) },
                    { path: 'offices', loadComponent: () => import('./features/admin/offices/offices.component').then(m => m.OfficesComponent) },
                    { path: 'schedules', loadComponent: () => import('./features/admin/schedules/schedules.component').then(m => m.SchedulesComponent) },
                    { path: 'appointments', loadComponent: () => import('./features/admin/appointments/appointments.component').then(m => m.AppointmentsComponent) }
                ]
            },
            {
                path: 'dentist',
                canMatch: [roleGuard(['dentist'])], // 👈 Solo dentista
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./features/dentist/dentist-dashboard.component')
                                .then(m => m.DentistDashboardComponent),
                    },
                    {
                        path: 'appointments',
                        loadComponent: () =>
                            import('./features/dentist/appointments/appointments.component')
                                .then(m => m.DentistAppointmentsComponent),
                    },
                    {
                        path: 'schedules',
                        loadComponent: () =>
                            import('./features/dentist/schedules/schedules.component')
                                .then(m => m.DentistSchedulesComponent),
                    }
                ]
            }
            ,
            {
                path: 'patient',
                canMatch: [roleGuard(['patient'])], // 👈 Solo pacientes
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./features/patient/patient-dashboard.component')
                                .then(m => m.PatientDashboardComponent),
                        children: [
                            {
                                path: 'appointments',
                                loadComponent: () =>
                                    import('./features/patient/appointments/appointments.component')
                                        .then(m => m.PatientAppointmentsComponent),
                            },
                            {
                                path: 'new-appointment',
                                loadComponent: () =>
                                    import('./features/patient/appointments/new-appointment.component')
                                        .then(m => m.NewAppointmentComponent),
                            },
                            {
                                path: 'profile',
                                loadComponent: () =>
                                    import('./features/patient/profile/profile.component')
                                        .then(m => m.PatientProfileComponent),
                            },
                            { path: '', redirectTo: 'appointments', pathMatch: 'full' }
                        ]
                    }
                ]
            }
            ,
            { path: '', redirectTo: 'patient', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
