import { Controller, Post, Body, UnauthorizedException, UseGuards, Request, InternalServerErrorException, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.username, body.password);
  }

  @Post('forgot-password')
  async forgotPassword() {
    try {
      return await this.authService.forgotPassword();
    } catch (err: any) {
      throw new InternalServerErrorException(err.message || 'Error processing forgot password');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { token: string; newPass: string }) {
    return this.authService.resetPassword(data.token, data.newPass);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-credentials')
  async updateCredentials(@Request() req, @Body() body: any) {
    return this.authService.updateCredentials(
      req.user.userId,
      body.currentPassword,
      body.newUsername,
      body.newPassword,
    );
  }
}
