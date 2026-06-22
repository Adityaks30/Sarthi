import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { FloatingBotComponent } from './components/floating-bot/floating-bot.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FloatingBotComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class App implements OnInit {
  protected readonly title = signal('Sarthi');
  isDarkMode = true;
  mobileMenuOpen = false;
  currentUser: any = null;
  currentUrl = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUser();
    
    // Subscribe to router changes to highlight active navigation link and track current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects || event.url;
      this.checkUser();
      this.mobileMenuOpen = false; // close mobile menu on navigation
    });
  }

  checkUser() {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      this.currentUser = JSON.parse(cachedUser);
    } else {
      this.currentUser = null;
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const bodyClass = document.body.classList;
    if (this.isDarkMode) {
      bodyClass.remove('light-mode');
      bodyClass.add('dark-mode');
    } else {
      bodyClass.remove('dark-mode');
      bodyClass.add('light-mode');
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  handleLogout() {
    localStorage.removeItem('user');
    this.currentUser = null;
    alert('Logged out successfully.');
    this.router.navigate(['/auth']);
  }
}
