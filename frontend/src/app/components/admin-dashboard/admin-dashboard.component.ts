import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../config';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'stats' | 'users' | 'drivers' | 'bookings' = 'stats';

  stats: any = {
    totalClients: 0,
    totalDrivers: 0,
    totalVehicles: 0,
    activeBookings: 0,
    openTickets: 0,
    totalEarnings: 0
  };

  users: any[] = [];
  drivers: any[] = [];
  bookings: any[] = [];
  earningsAnalytics: any[] = [];

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    // 1. Fetch Stats
    fetch(`${API_BASE_URL}/admin/stats`)
      .then(res => res.json())
      .then(data => this.stats = data)
      .catch(err => console.error('Error fetching admin stats:', err));

    // 2. Fetch Users
    fetch(`${API_BASE_URL}/admin/users`)
      .then(res => res.json())
      .then(data => this.users = data)
      .catch(err => console.error('Error fetching users:', err));

    // 3. Fetch Drivers
    fetch(`${API_BASE_URL}/admin/drivers`)
      .then(res => res.json())
      .then(data => this.drivers = data)
      .catch(err => console.error('Error fetching drivers:', err));

    // 4. Fetch Bookings
    fetch(`${API_BASE_URL}/admin/bookings`)
      .then(res => res.json())
      .then(data => this.bookings = data)
      .catch(err => console.error('Error fetching bookings:', err));

    // 5. Fetch Analytics
    fetch(`${API_BASE_URL}/admin/analytics/earnings`)
      .then(res => res.json())
      .then(data => this.earningsAnalytics = data)
      .catch(err => console.error('Error fetching earnings analytics:', err));
  }
}
