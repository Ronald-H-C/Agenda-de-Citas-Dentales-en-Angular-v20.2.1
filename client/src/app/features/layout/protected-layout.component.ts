import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
    selector: 'app-protected-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, HeaderComponent],
    template: `
    <app-header></app-header>
    <div class="layout-container">
      <router-outlet></router-outlet>
    </div>
  `,
    styles: [`
    .layout-container {
      padding: 1rem;
    }
  `]
})
export class ProtectedLayoutComponent { }
