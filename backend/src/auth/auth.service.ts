import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, pass: string) {
    const password_hash = await bcrypt.hash(pass, 10);
    const user = this.usersRepository.create({ username, password_hash });
    return this.usersRepository.save(user);
  }

  async forgotPassword() {
    // For this portfolio, we treat 'admin' as the primary user
    const user = await this.usersRepository.findOne({ where: { username: 'admin' } });
    if (!user) throw new Error('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.usersRepository.save(user);
    
    // Automatically send to the admin's email stored in EMAIL_USER
    const adminEmail = process.env.EMAIL_USER;
    if (!adminEmail) throw new Error('Admin email not configured');
    
    await this.mailService.sendPasswordResetEmail(adminEmail, token);

    return { message: 'Reset email sent to admin' };
  }

  async resetPassword(token: string, newPass: string) {
    const user = await this.usersRepository.findOne({ 
      where: { resetToken: token } 
    });

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new Error('Invalid or expired token');
    }

    user.password_hash = await bcrypt.hash(newPass, 10);
    (user as any).resetToken = null;
    (user as any).resetTokenExpires = null;

    await this.usersRepository.save(user);
    return { message: 'Password updated successfully' };
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId as any } });
    if (!user) throw new Error('User not found');

    if (!(await bcrypt.compare(currentPass, user.password_hash))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password_hash = await bcrypt.hash(newPass, 10);
    await this.usersRepository.save(user);
    
    return { message: 'Password changed successfully' };
  }
}
