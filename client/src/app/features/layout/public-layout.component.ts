import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="public-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .public-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f9fafb;
      padding: 2rem;
    }
  `]
})
export class PublicLayoutComponent { }
