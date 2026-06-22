import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-floating-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './floating-bot.component.html',
  styleUrls: ['./floating-bot.component.css']
})
export class FloatingBotComponent implements OnInit {
  isOpen = false;
  messages: { sender: 'bot' | 'user'; text: string; time: Date }[] = [
    { sender: 'bot', text: 'Hello! I am your Sarthi Assistant. Ask me anything about bookings, fares, refunds, or support.', time: new Date() }
  ];
  userMessage = '';

  ngOnInit() {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    const userText = this.userMessage;
    this.messages.push({ sender: 'user', text: userText, time: new Date() });
    this.userMessage = '';
    
    // Call backend API
    fetch('http://localhost:3000/support/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    })
    .then(res => res.json())
    .then((data: any) => {
      this.messages.push({ sender: 'bot', text: data.reply, time: new Date() });
    })
    .catch(err => {
      console.error('Error calling chatbot:', err);
      this.messages.push({ sender: 'bot', text: 'Sorry, I am facing a connection issue.', time: new Date() });
    });
  }
}
