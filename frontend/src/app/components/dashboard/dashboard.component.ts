import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Favorite Drivers
  favoriteDrivers = [
    { name: 'Ramesh Kumar', rating: 4.9, avatar: '👨✈️', phone: '+91 98765 43210', status: 'Online' },
    { name: 'Anil Vasudevan', rating: 4.8, avatar: '👨✈️', phone: '+91 98765 43211', status: 'Offline' },
    { name: 'Priya Singh', rating: 4.7, avatar: '👩✈️', phone: '+91 98765 43212', status: 'Online' },
    { name: 'Suresh Prasad', rating: 4.6, avatar: '👨✈️', phone: '+91 98765 43213', status: 'Offline' },
    { name: 'Aditya Sen', rating: 4.9, avatar: '👨✈️', phone: '+91 98765 43214', status: 'Online' }
  ];
}
