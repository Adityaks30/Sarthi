import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  // Form state
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  contactSubject = '';
  contactMessage = '';

  officeDetails = {
    phone: '+91 82879 92549',
    whatsapp: '+91 82879 92549',
    email: 'nextvision@gmail.com',
    address: 'Kalindi Kunj Metro Station, New Delhi, Delhi 110025',
    mapsIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.5779035624734!2d77.3039121!3d28.5524317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce44955555555%3A0xe98be2bc820980c9!2sKalindi%20Kunj%20Metro%20Station!5e0!3m2!1sen!2sin'
  };

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  submitContact() {
    if (!this.contactName || !this.contactEmail || !this.contactMessage) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Simulate contact submission
    alert(`Thank you ${this.contactName}! Your message regarding "${this.contactSubject || 'General Inquiry'}" has been successfully sent. Our support desk will reach out to you within 24 hours.`);
    
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.contactSubject = '';
    this.contactMessage = '';
  }
}
