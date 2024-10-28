// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { GeneralComponent } from './features/general/general.component';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';
import { KnowledgeBaseComponent } from './features/knowledge-base/knowledge-base.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'general',
    component: GeneralComponent,
  },
  {
    path: 'knowledge-base',
    component: KnowledgeBaseComponent,
  },
  // Placeholder routes for other sections
  { path: 'knowledge-base', component: PlaceholderComponent },
  { path: 'metadata', component: PlaceholderComponent },
  { path: 'parameters', component: PlaceholderComponent },
  { path: 'prompt', component: PlaceholderComponent },
];
