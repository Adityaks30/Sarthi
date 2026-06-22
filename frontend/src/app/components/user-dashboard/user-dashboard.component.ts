import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  // Profile State
  currentUser: any = {
    name: 'Aditya Kashyap',
    email: 'client_user@taxi.com',
    phone: '+91 99999 99999',
    loyaltyPoints: 150,
    referralCode: 'ADITYA99'
  };

  // Saved Addresses State
  savedAddresses = [
    { label: '🏠 Home', address: '12, Palace Road, Vasanth Nagar, Bangalore' },
    { label: '💼 Work', address: 'Embassy Tech Village, Outer Ring Road, Bangalore' },
    { label: '💪 Gym', address: 'Gold\'s Gym, Sadashiva Nagar, Bangalore' }
  ];
  newLabel = '';
  newAddress = '';

  // Bookings & Payments History State
  bookings: any[] = [];
  payments: any[] = [];

  // Favorite Drivers
  favoriteDrivers = [
    { name: 'Ramesh Kumar', rating: 4.9, avatar: '👨✈️', phone: '+91 98765 43210', status: 'Online' },
    { name: 'Anil Vasudevan', rating: 4.8, avatar: '👨✈️', phone: '+91 98765 43211', status: 'Offline' },
    { name: 'Priya Singh', rating: 4.7, avatar: '👩✈️', phone: '+91 98765 43212', status: 'Online' }
  ];

  // System Notifications
  notifications = [
    { id: '1', title: 'Loyalty Rewards!', message: 'You have earned 50 new loyalty points for referring Anil.', time: '2 hours ago' },
    { id: '2', title: 'Ride Completed', message: 'Your rental trip in Brezza SUV has been successfully completed.', time: 'Yesterday' }
  ];

  ngOnInit(): void {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      this.currentUser = JSON.parse(cachedUser);
    }

    // Fetch booking history from NestJS
    fetch('http://localhost:3000/admin/bookings')
      .then(res => res.json())
      .then((data: any[]) => {
        this.bookings = data.filter(b => b.userId === this.currentUser.id || b.userId === 'test-client-id');
      })
      .catch(err => console.error('Error fetching bookings:', err));

    // Fetch payments history from NestJS
    fetch('http://localhost:3000/payments/history')
      .then(res => res.json())
      .then((data: any[]) => {
        this.payments = data;
      })
      .catch(err => console.error('Error fetching payments:', err));
  }

  addAddress() {
    if (this.newLabel && this.newAddress) {
      this.savedAddresses.push({
        label: this.newLabel,
        address: this.newAddress
      });
      this.newLabel = '';
      this.newAddress = '';
    }
  }

  removeAddress(index: number) {
    this.savedAddresses.splice(index, 1);
  }

  redeemPoints() {
    if (this.currentUser.loyaltyPoints >= 100) {
      this.currentUser.loyaltyPoints -= 100;
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      alert('100 Points Redeemed! A discount coupon SWIFTRIDE100 has been sent to your registered email.');
    } else {
      alert('You need at least 100 loyalty points to redeem a discount voucher.');
    }
  }
}
