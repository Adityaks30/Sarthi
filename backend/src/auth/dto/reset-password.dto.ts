export class ResetPasswordDto {
  email: string;
  token?: string;
  newPassword?: string;
  isForgotRequest?: boolean; // If true, only generate and send the reset token
}
