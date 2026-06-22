import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Helper to generate a mock referral code
  private generateReferralCode(name: string): string {
    const cleanName = name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${cleanName}${rand}`;
  }

  async signup(dto: SignupDto): Promise<User> {
    const existingEmail = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingEmail) {
      throw new BadRequestException('Email already registered');
    }

    const existingPhone = await this.userRepository.findOne({ where: { phone: dto.phone } });
    if (existingPhone) {
      throw new BadRequestException('Phone number already registered');
    }

    const user = new User();
    user.email = dto.email;
    user.name = dto.name;
    user.phone = dto.phone;
    user.role = dto.role || UserRole.CLIENT;
    user.referralCode = this.generateReferralCode(dto.name);
    user.loyaltyPoints = 0;

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    // Process referral code if provided
    if (dto.referralCode) {
      const referrer = await this.userRepository.findOne({ where: { referralCode: dto.referralCode } });
      if (referrer) {
        user.referredBy = referrer.referralCode;
        // Award referral points (e.g. 50 points each)
        referrer.loyaltyPoints += 50;
        await this.userRepository.save(referrer);
        user.loyaltyPoints += 50;
      }
    }

    return await this.userRepository.save(user);
  }

  async login(dto: LoginDto): Promise<{ user: User; message: string; otpCode?: string }> {
    const user = await this.userRepository.findOne({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.isOtpLogin) {
      // Generate a mock 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = otp;
      user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
      await this.userRepository.save(user);
      
      console.log(`[SMS/WhatsApp Twilio Simulator] OTP sent to ${user.phone}: ${otp}`);
      return { user, message: 'OTP sent successfully', otpCode: otp };
    }

    if (!dto.password || !user.password) {
      throw new BadRequestException('Password required for standard login');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { user, message: 'Login successful' };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
    });

    if (!user || !user.otpCode || !user.otpExpires) {
      throw new BadRequestException('No active OTP found');
    }

    if (new Date() > user.otpExpires) {
      throw new BadRequestException('OTP has expired');
    }

    if (user.otpCode !== dto.otp) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Clear OTP details upon verification
    user.otpCode = undefined;
    user.otpExpires = undefined;
    return await this.userRepository.save(user);
  }

  async requestPasswordReset(dto: ResetPasswordDto): Promise<{ message: string; resetToken?: string }> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    // Generate mock reset token
    const token = Math.random().toString(36).substring(2, 15);
    user.passwordResetToken = token;
    await this.userRepository.save(user);

    console.log(`[Email Simulator] Reset token sent to ${user.email}: ${token}`);
    return { message: 'Password reset link sent to email', resetToken: token };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user || user.passwordResetToken !== dto.token) {
      throw new BadRequestException('Invalid reset token or email');
    }

    if (!dto.newPassword) {
      throw new BadRequestException('New password is required');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.passwordResetToken = undefined; // Clear token
    return await this.userRepository.save(user);
  }
}
