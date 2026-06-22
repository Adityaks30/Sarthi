import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component.js';
import { AuthComponent } from './components/auth/auth.component.js';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component.js';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component.js';
import { SupportComponent } from './components/support/support.component.js';
import { AboutComponent } from './components/about/about.component.js';
import { FaqComponent } from './components/faq/faq.component.js';
import { ContactComponent } from './components/contact/contact.component.js';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'support', component: SupportComponent },
  { path: 'about', component: AboutComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
