import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../config';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  authMode: 'login' | 'signup' | 'forgot' | 'otp' = 'login';
  
  // Login State
  loginEmail = '';
  loginPhone = '';
  loginPassword = '';
  isOtpLogin = false;

  // Signup State
  signupName = '';
  signupEmail = '';
  signupPhone = '';
  signupPassword = '';
  signupReferralCode = '';

  // Forgot Password State
  forgotEmail = '';
  resetToken = '';
  newPassword = '';
  resetSent = false;

  // OTP State
  otpVal = '';
  otpMessage = '';

  errorMessage = '';
  successMessage = '';

  constructor(private router: Router) {}

  switchMode(mode: 'login' | 'signup' | 'forgot' | 'otp') {
    this.authMode = mode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  handleLogin() {
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.isOtpLogin
      ? { phone: this.loginPhone, isOtpLogin: true }
      : { email: this.loginEmail, password: this.loginPassword };

    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Authentication failed');
      return res.json();
    })
    .then((data: any) => {
      if (this.isOtpLogin) {
        this.successMessage = `OTP Simulator: sent ${data.otpCode} to ${this.loginPhone}`;
        this.switchMode('otp');
      } else {
        localStorage.setItem('user', JSON.stringify(data.user));
        this.router.navigate(['/']);
      }
    })
    .catch(err => {
      this.errorMessage = err.message || 'Login failed. Please check your credentials.';
    });
  }

  handleSignup() {
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      email: this.signupEmail,
      phone: this.signupPhone,
      password: this.signupPassword,
      name: this.signupName,
      referralCode: this.signupReferralCode || undefined
    };

    fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    })
    .then((user: any) => {
      this.successMessage = 'Registration successful! You can now log in.';
      localStorage.setItem('user', JSON.stringify(user));
      setTimeout(() => this.switchMode('login'), 1500);
    })
    .catch(err => {
      this.errorMessage = err.message || 'Signup failed. Please try again.';
    });
  }

  handleVerifyOtp() {
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      phone: this.loginPhone,
      otp: this.otpVal
    };

    fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Invalid OTP');
      return res.json();
    })
    .then((user: any) => {
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/']);
    })
    .catch(err => {
      this.errorMessage = err.message || 'OTP verification failed.';
    });
  }

  handleForgotPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.resetSent) {
      // First request: generate token
      fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.forgotEmail, isForgotRequest: true })
      })
      .then(res => {
        if (!res.ok) throw new Error('Email not found');
        return res.json();
      })
      .then((data: any) => {
        this.resetSent = true;
        this.successMessage = `Reset token simulator: sent token ${data.resetToken} to ${this.forgotEmail}`;
      })
      .catch(err => {
        this.errorMessage = err.message || 'Forgot password request failed.';
      });
    } else {
      // Second request: reset password
      fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.forgotEmail, token: this.resetToken, newPassword: this.newPassword })
      })
      .then(res => {
        if (!res.ok) throw new Error('Token verification failed');
        return res.json();
      })
      .then(() => {
        this.successMessage = 'Password reset successfully! Redirecting to login...';
        setTimeout(() => {
          this.resetSent = false;
          this.switchMode('login');
        }, 1500);
      })
      .catch(err => {
        this.errorMessage = err.message || 'Password reset failed.';
      });
    }
  }

  mockSocialLogin(provider: string) {
    this.successMessage = `Mocked social login via ${provider}! Redirecting...`;
    const mockUser = {
      id: '00000000-0000-0000-0000-000000000000',
      email: `${provider.toLowerCase()}_user@taxi.com`,
      name: `${provider} User`,
      phone: '+919999999999',
      role: 'CLIENT',
      loyaltyPoints: 100
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setTimeout(() => this.router.navigate(['/']), 1000);
  }
}
