import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service.js';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return await this.adminService.getDashboardStats();
  }

  @Get('users')
  async getUsers() {
    return await this.adminService.getUsers();
  }

  @Get('drivers')
  async getDrivers() {
    return await this.adminService.getDrivers();
  }

  @Get('vehicles')
  async getVehicles() {
    return await this.adminService.getVehicles();
  }

  @Get('bookings')
  async getBookings() {
    return await this.adminService.getBookings();
  }

  @Get('analytics/earnings')
  async getEarnings() {
    return await this.adminService.getEarningsAnalytics();
  }
}
