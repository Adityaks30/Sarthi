import { UserRole } from '../../database/entities/user.entity.js';

export class SignupDto {
  email: string;
  password?: string;
  name: string;
  phone: string;
  role?: UserRole;
  referralCode?: string; // Code they signed up with (optional)
}
