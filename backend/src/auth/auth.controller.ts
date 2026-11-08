import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

interface AuthenticatedRequest extends ExpressRequest {
  user: { userId: string };
}

interface LoginBody {
  username: string;
  password: string;
}

interface RegisterBody {
  username: string;
  password: string;
}

interface UpdateCredentialsBody {
  currentPassword: string;
  newUsername?: string;
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginBody) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: RegisterBody) {
    return this.authService.register(body.username, body.password);
  }

  @Post('forgot-password')
  async forgotPassword() {
    try {
      return await this.authService.forgotPassword();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : 'Error processing forgot password';
      throw new InternalServerErrorException(errMsg);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { token: string; newPass: string }) {
    return this.authService.resetPassword(data.token, data.newPass);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-credentials')
  async updateCredentials(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateCredentialsBody,
  ) {
    const user = req.user;
    return this.authService.updateCredentials(
      user.userId,
      body.currentPassword,
      body.newUsername,
      body.newPassword,
    );
  }
}
