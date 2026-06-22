import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { RouterLink } from '@angular/router';
import { API_BASE_URL, SOCKET_URL } from '../../config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Map and Location State
  startLat = 28.5431;
  startLng = 77.3065;
  startAddress = 'Kalindi Kunj Metro Station, New Delhi';
  
  endLat = 28.5562;
  endLng = 77.1000;
  endAddress = 'Indira Gandhi International Airport (DEL), Delhi';
  
  pickupDate = new Date().toISOString().split('T')[0];
  pickupTime = '10:00';
  driverOption: 'WITH_DRIVER' | 'SELF_DRIVE' = 'WITH_DRIVER';
  
  calculatedDistance = 35.2; // in km
  calculatedDuration = 52; // in minutes

  // Wizard State
  wizardStep = 1; // 1: Select Details, 2: Payment, 3: Simulation / Live Status
  bookingMode: 'RIDE' | 'RENTAL' = 'RIDE';
  selectedCategory = 'SEDAN';
  couponCode = '';
  couponApplied = false;
  couponDiscount = 0;
  
  // Rental Customizations
  selectedVehicle: any = null;
  rentalDurationType: 'HOURS' | 'DAYS' = 'HOURS';
  rentalDurationCount = 2;
  
  // Estimate properties
  selectedEstimate: any = { fare: 450 };
  selectedRentalPackage: any = { id: 'pkg-1', name: '2 Hours / 20 Km', price: 600 };
  
  // Booking API Response State
  pendingBookingBody: any = null;
  activeBookingId = '';
  activeBookingStatus = 'PENDING';
  matchedDriver: any = null;
  driverLocation: any = null;

  // Mock Vehicles for Rentals & Rides
  rentalVehicles = [
    { id: 'v1', name: 'Suzuki Swift', category: 'HATCHBACK', capacity: '5 Seater', ac: 'AC', driverIncluded: true, priceHour: 80, priceDay: 600, rating: 4.8, avatar: '🚗' },
    { id: 'v2', name: 'Hyundai Verna', category: 'SEDAN', capacity: '5 Seater', ac: 'AC', driverIncluded: true, priceHour: 120, priceDay: 1000, rating: 4.9, avatar: '🚘' },
    { id: 'v3', name: 'Mahindra XUV700', category: 'SUV', capacity: '7 Seater', ac: 'AC', driverIncluded: true, priceHour: 180, priceDay: 1500, rating: 4.7, avatar: '🚙' },
    { id: 'v4', name: 'Mercedes Benz E-Class', category: 'LUXURY', capacity: '5 Seater', ac: 'AC', driverIncluded: true, priceHour: 350, priceDay: 3000, rating: 4.9, avatar: '🏎️' },
    { id: 'v5', name: 'Force Tempo Traveller', category: 'TEMPO_TRAVELLER', capacity: '12 Seater', ac: 'AC', driverIncluded: true, priceHour: 250, priceDay: 2200, rating: 4.6, avatar: '🚐' },
    { id: 'v6', name: 'Eicher Mini Bus', category: 'MINI_BUS', capacity: '24 Seater', ac: 'AC', driverIncluded: true, priceHour: 400, priceDay: 3500, rating: 4.5, avatar: '🚌' },
    { id: 'v7', name: 'Rolls Royce Ghost', category: 'PREMIUM_CHAUFFEUR', capacity: '4 Seater', ac: 'AC', driverIncluded: true, priceHour: 800, priceDay: 7500, rating: 5.0, avatar: '🎩' }
  ];

  // Rental Packages
  rentalPackages = [
    { id: 'pkg-1', name: '2 Hours / 20 Km', price: 500 },
    { id: 'pkg-2', name: '4 Hours / 40 Km', price: 900 },
    { id: 'pkg-3', name: '8 Hours / 80 Km', price: 1800 }
  ];

  // Socket instance
  private socket!: Socket;

  // Verified Drivers Array
  verifiedDrivers = [
    { name: 'Ramesh Kumar', rating: 4.9, trips: 1420, language: 'English, Kannada, Hindi', reviews: 'Very polite, drives extremely safely.', avatar: '👨✈️' },
    { name: 'Anil Vasudevan', rating: 4.8, trips: 980, language: 'English, Hindi, Punjabi', reviews: 'On time, knows Delhi NCR shortcuts perfectly.', avatar: '👨‍✈️' },
    { name: 'Priya Singh', rating: 4.7, trips: 850, language: 'English, Hindi, Punjabi', reviews: 'Very friendly and smooth driving style.', avatar: '👩‍✈️' },
    { name: 'Suresh Prasad', rating: 4.6, trips: 1120, language: 'English, Hindi, Telugu', reviews: 'Excellent route knowledge and helpful.', avatar: '👨✈️' },
    { name: 'Aditya Sen', rating: 4.9, trips: 640, language: 'English, Bengali, Hindi', reviews: 'Luxury chauffeur style, extremely professional.', avatar: '👨✈️' }
  ];

  // Payment Method Selection
  selectedPaymentMethod: 'UPI' | 'CASH' = 'UPI';
  upiId = 'adityakashyap2515@oksbi';

  ngOnInit(): void {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Connect to WebSocket gateway
    this.socket = io(SOCKET_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to simulation WebSocket server');
    });

    // Listen for simulation updates
    this.socket.on('booking:status_changed', (data: any) => {
      console.log('Booking status update:', data);
      if (data.bookingId === this.activeBookingId) {
        this.activeBookingStatus = data.status;
        if (data.driver) {
          this.matchedDriver = data.driver;
        }

        // Add real notification
        const statusNotif = {
          id: Math.random().toString(36).substring(2, 9),
          title: `Booking Status: ${data.status}`,
          message: data.status === 'ACCEPTED' 
            ? `Your ride request has been accepted by ${data.driver?.name || 'a driver'}.` 
            : `Your ride status is now ${data.status}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const existingNotifs = JSON.parse(localStorage.getItem('sarthi_notifications') || '[]');
        existingNotifs.unshift(statusNotif);
        localStorage.setItem('sarthi_notifications', JSON.stringify(existingNotifs));

        // Trigger system notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Sarthi: Ride ${data.status}`, {
            body: data.status === 'ACCEPTED' ? `Driver ${data.driver?.name || ''} is on the way!` : `Status: ${data.status}`,
          });
        }
      }
    });

    this.socket.on('driver:location_updated', (data: any) => {
      console.log('Driver location update:', data);
      if (data.bookingId === this.activeBookingId) {
        this.driverLocation = { lat: data.latitude, lng: data.longitude };
      }
    });
  }

  get calculatedRentalFare(): number {
    if (!this.selectedVehicle) return this.selectedRentalPackage?.price || 600;
    const basePrice = this.rentalDurationType === 'HOURS'
      ? this.selectedVehicle.priceHour * this.rentalDurationCount
      : this.selectedVehicle.priceDay * this.rentalDurationCount;
    return basePrice;
  }

  getCurrentFare(): number {
    let baseFare = 450;
    if (this.bookingMode === 'RENTAL') {
      baseFare = this.selectedVehicle ? this.calculatedRentalFare : (this.selectedRentalPackage?.price || 600);
    } else {
      baseFare = this.selectedEstimate?.fare || 450;
    }
    const finalFare = baseFare - this.couponDiscount;
    return finalFare > 0 ? finalFare : 0;
  }

  applyCoupon() {
    this.couponCode = this.couponCode.trim().toUpperCase();
    if (this.couponCode === 'SAVEMORE') {
      this.couponApplied = true;
      this.couponDiscount = 50;
      alert('Coupon SAVEMORE applied successfully! ₹50 discount applied.');
    } else if (this.couponCode === 'WELCOME100') {
      this.couponApplied = true;
      this.couponDiscount = 100;
      alert('Coupon WELCOME100 applied successfully! ₹100 discount applied.');
    } else if (this.couponCode === 'LOYALTY50') {
      this.couponApplied = true;
      this.couponDiscount = 50;
      alert('Coupon LOYALTY50 applied successfully! ₹50 discount applied.');
    } else {
      this.couponApplied = false;
      this.couponDiscount = 0;
      alert('Invalid coupon code.');
    }
  }

  calculateRoute() {
    if (!this.startAddress || !this.endAddress) return;
    
    // Simple hash to generate consistent distance based on input names
    const textHash = (this.startAddress.length + this.endAddress.length) % 45;
    this.calculatedDistance = Math.round((8 + textHash * 1.1) * 10) / 10;
    this.calculatedDuration = Math.round(this.calculatedDistance * 1.6);
    
    // Base km rate map
    const ratePerKm: { [key: string]: number } = {
      HATCHBACK: 10,
      SEDAN: 14,
      SUV: 20,
      LUXURY: 32,
      TEMPO_TRAVELLER: 40,
      MINI_BUS: 60,
      PREMIUM_CHAUFFEUR: 85
    };
    
    const baseFare = 60;
    const perKmRate = ratePerKm[this.selectedCategory] || 14;
    this.selectedEstimate = {
      fare: Math.round(baseFare + this.calculatedDistance * perKmRate)
    };
  }

  onBookNow(veh?: any): void {
    if (veh) {
      this.selectedVehicle = veh;
      this.bookingMode = 'RENTAL';
      this.selectedCategory = veh.category;
      this.rentalDurationType = 'HOURS';
      this.rentalDurationCount = 2;
    } else {
      this.selectedVehicle = null;
    }
    
    // Prepare the payload body
    let body: any;
    if (this.bookingMode === 'RENTAL') {
      body = {
        isRental: true,
        startLatitude: this.startLat,
        startLongitude: this.startLng,
        startAddress: this.startAddress,
        rentalPackageId: this.selectedRentalPackage.id,
        vehicleCategory: this.selectedCategory,
        couponCode: this.couponCode || undefined,
        customFare: this.getCurrentFare(),
        isSelfDrive: this.driverOption === 'SELF_DRIVE'
      };
    } else {
      body = {
        isRental: false,
        startLatitude: this.startLat,
        startLongitude: this.startLng,
        startAddress: this.startAddress,
        endAddress: this.endAddress,
        vehicleCategory: this.selectedCategory,
        couponCode: this.couponCode || undefined,
        customFare: this.getCurrentFare()
      };
    }

    this.pendingBookingBody = body;
    this.wizardStep = 2; // Advance to Payment Wizard step
  }

  selectRentalPackage(pkg: any) {
    this.selectedRentalPackage = pkg;
    if (this.pendingBookingBody) {
      this.pendingBookingBody.rentalPackageId = pkg.id;
      this.pendingBookingBody.customFare = pkg.price;
    }
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.calculateRoute();
  }

  processPayment(): void {
    const fare = this.getCurrentFare();
    if (this.pendingBookingBody) {
      this.pendingBookingBody.customFare = fare;
      if (this.bookingMode === 'RENTAL' && this.selectedVehicle) {
        this.pendingBookingBody.endAddress = `Rental: ${this.selectedVehicle.name} for ${this.rentalDurationCount} ${this.rentalDurationType.toLowerCase()} (${this.driverOption.replace('_', ' ')})`;
      }
    }

    // Call backend API to create the booking
    fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.pendingBookingBody)
    })
    .then(res => res.json())
    .then((booking: any) => {
      this.activeBookingId = booking.id;
      this.activeBookingStatus = booking.status;
      
      // Save notification to localStorage for dashboard
      const newNotif = {
        id: Math.random().toString(36).substring(2, 9),
        title: 'Booking Placed',
        message: `Your booking for ${booking.startAddress} has been successfully requested.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const existingNotifs = JSON.parse(localStorage.getItem('sarthi_notifications') || '[]');
      existingNotifs.unshift(newNotif);
      localStorage.setItem('sarthi_notifications', JSON.stringify(existingNotifs));

      // Trigger browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Sarthi: Booking Placed!', {
          body: `Your ride is pending driver acceptance.`,
        });
      } else {
        alert(`Booking Placed successfully!\nStatus: PENDING\nMethod: ${this.selectedPaymentMethod}`);
      }

      // Record the payment details in NestJS
      fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: fare,
          method: this.selectedPaymentMethod
        })
      })
      .then(pres => pres.json())
      .then(payment => {
        console.log('Payment recorded successfully:', payment);
      })
      .catch(perr => {
        console.error('Error recording payment:', perr);
      });
      
      // Join WebSocket room for updates
      this.socket.emit('join_booking', { bookingId: booking.id });
      this.wizardStep = 3; // Go to simulation dashboard step
    })
    .catch(err => {
      console.error('Error creating booking:', err);
      alert('Failed to place booking. Please check database connection.');
    });
  }

  resetBooking() {
    this.wizardStep = 1;
    this.pendingBookingBody = null;
    this.activeBookingId = '';
    this.activeBookingStatus = 'PENDING';
    this.matchedDriver = null;
    this.driverLocation = null;
    this.selectedVehicle = null;
    this.couponApplied = false;
    this.couponDiscount = 0;
    this.couponCode = '';
  }
}
