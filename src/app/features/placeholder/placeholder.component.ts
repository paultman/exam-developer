// src/app/features/placeholder/placeholder.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h2>Dashboard Coming Soon</h2>
      <p>
        This is a temporary placeholder until we implement the dashboard
        component.
      </p>
    </div>
  `,
})
export class PlaceholderComponent {}
