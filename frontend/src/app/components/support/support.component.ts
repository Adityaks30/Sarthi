import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  // Support Ticketing State
  category = 'Booking Issue';
  subject = '';
  message = '';
  myTickets: any[] = [];

  // Chatbot State
  chatbotMessages: { sender: 'bot' | 'user'; text: string; time: Date }[] = [
    { sender: 'bot', text: 'Hello! I am your Sarthi Assistant. How can I help you today?', time: new Date() }
  ];
  userMessage = '';

  currentUser: any = { id: '00000000-0000-0000-0000-000000000000' };

  ngOnInit(): void {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      this.currentUser = JSON.parse(cachedUser);
    }
    this.fetchTickets();
  }

  fetchTickets() {
    fetch(`http://localhost:3000/support/tickets/user/${this.currentUser.id}`)
      .then(res => res.json())
      .then((data: any[]) => {
        this.myTickets = data;
      })
      .catch(err => console.error('Error fetching tickets:', err));
  }

  sendTicket() {
    if (!this.subject || !this.message) {
      alert('Please fill out the subject and message fields.');
      return;
    }

    const payload = {
      userId: this.currentUser.id,
      category: this.category,
      subject: this.subject,
      message: this.message
    };

    fetch('http://localhost:3000/support/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      alert('Support ticket submitted successfully! Our help desk will reply shortly.');
      this.subject = '';
      this.message = '';
      this.fetchTickets(); // Refresh list
    })
    .catch(err => console.error('Error sending ticket:', err));
  }

  sendMessageToBot() {
    if (!this.userMessage.trim()) return;

    const userText = this.userMessage;
    this.chatbotMessages.push({ sender: 'user', text: userText, time: new Date() });
    this.userMessage = '';

    fetch('http://localhost:3000/support/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    })
    .then(res => res.json())
    .then((data: any) => {
      this.chatbotMessages.push({ sender: 'bot', text: data.reply, time: new Date() });
    })
    .catch(err => {
      console.error('Error calling chatbot:', err);
      this.chatbotMessages.push({ sender: 'bot', text: 'Sorry, I am facing a connection issue.', time: new Date() });
    });
  }
}
