import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqs = [
    {
      question: 'How do I book a taxi on Sarthi?',
      answer: 'Simply enter your pickup and drop locations on our Home page booking wizard, choose your preferred vehicle class (Mini, Sedan, SUV, or Luxury), select your payment option, and click "Pay & Initiate Simulation" to book your ride instantly.',
      open: false
    },
    {
      question: 'How is the fare calculated?',
      answer: 'Our pricing is highly transparent. For dynamic rides, fares are based on base rates, total route distance, estimated travel time, and optional surge multipliers depending on high demand. For car rentals, pricing is determined per hour or per day as listed on the vehicle cards.',
      open: false
    },
    {
      question: 'What is the driver verification process?',
      answer: 'All Sarthi chauffeurs undergo background screening, criminal record validation, and practical driving evaluations. We display active ratings and trip completions for each driver in the active drivers roster.',
      open: false
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'You can cancel any booking before the driver arrives at your pickup location without penalty. Cancellations initiated after the driver reaches your location may incur a fee of ₹50 to compensate driver fuel and time.',
      open: false
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We support all major payment modes, including UPI apps (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), NetBanking, Mobile Wallets, and cash payouts to drivers directly.',
      open: false
    },
    {
      question: 'What is the refund policy?',
      answer: 'Refunds for bookings cancelled prior to departure are processed instantly back to your original payment method. Depending on banking networks, it may take 2-5 business days to reflect in your account statement.',
      open: false
    },
    {
      question: 'What are the requirements for self-drive rentals?',
      answer: 'To hire a self-drive vehicle, you must be at least 21 years of age, hold a valid Indian Driving License (LVM) for more than 1 year, and provide matching ID proof (Aadhaar or Passport) during vehicle pickup.',
      open: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
