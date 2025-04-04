import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route (Home)
  { path: 'contact', component: ContactComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect unknown routes to Home
];
