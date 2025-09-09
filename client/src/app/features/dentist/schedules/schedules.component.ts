import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DentistSchedulesService, DentistSchedule } from './schedules.service';

@Component({
    selector: 'app-dentist-schedules',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="schedules">
      <h3>Mis Horarios</h3>

      <ul *ngIf="schedules.length > 0; else noSchedules">
        <li *ngFor="let sch of schedules">
          {{ sch.day_of_week }}:
          {{ sch.start_time }} - {{ sch.end_time }}
          (Consultorio: {{ sch.office_name || 'Sin asignar' }})
        </li>
      </ul>

      <ng-template #noSchedules>
        <p>No tienes horarios registrados.</p>
      </ng-template>
    </section>
  `,
    styles: [`
    .schedules { padding: 1rem; }
    ul { list-style: none; padding: 0; }
    li { margin: 0.5rem 0; }
  `]
})
export class DentistSchedulesComponent implements OnInit {
    schedules: DentistSchedule[] = [];

    constructor(private service: DentistSchedulesService) { }

    ngOnInit(): void {
        this.service.getMySchedules().subscribe({
            next: (data) => this.schedules = data,
            error: (err) => console.error('❌ Error cargando horarios', err)
        });
    }
}
