import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  ownerInfo = {
    name: 'Aditya Kashyap',
    title: 'Founder & CEO, Sarthi',
    experience: '12+ years in Smart Mobility & Logistical Architecture',
    registrationDetails: 'Sarthi Mobility Solutions Private Limited | CIN: U60230KA2026PTC192837',
    founderMessage: 'At Sarthi, we are building more than a taxi booking app — we are crafting the next generation of urban transportation systems. By combining real-time simulation, AI-driven customer assistance, and transparent pricing engines, we ensure every ride is comfortable, safe, and professional.',
    officeAddress: 'Kalindi Kunj Metro Station, New Delhi, Delhi 110025',
    contactEmail: 'nextvision@gmail.com'
  };

  milestones = [
    { year: '2022', title: 'The Genesis', desc: 'Conceived the idea of a fully transparent chauffeur and cab booking experience with zero cancellations.' },
    { year: '2024', title: 'Fleet Expansion', desc: 'Introduced self-drive EVs and hourly rentals with integrated luxury vehicles across Delhi NCR.' },
    { year: '2026', title: 'Next-Gen Launch', desc: 'Launched Sarthi Web 3.0 Platform featuring live tracking telemetry and AI customer helpdesks.' }
  ];
}
