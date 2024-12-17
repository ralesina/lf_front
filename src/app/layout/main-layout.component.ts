import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  template: `
    <div class="page-container">
      <app-nav-bar></app-nav-bar>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .content {
      flex: 1;
      padding: 2rem;
      background-color: var(--color-light-yellow);
    }
  `]
})
export class MainLayoutComponent {}