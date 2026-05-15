import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');
    console.log(`[MailService] User: ${user}`);
    console.log(`[MailService] Pass Length: ${pass?.length}`);

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  async sendContactEmails(data: { name: string; email: string; subject: string; message: string }) {
    const adminEmail = this.configService.get<string>('EMAIL_USER');

    // 1. Alert to Admin
    const adminMailOptions = {
      from: `"Portfolio Contact Form" <${adminEmail}>`,
      to: adminEmail,
      subject: `New Contact Message: ${data.subject}`,
      html: `
        <h3>New message from ${data.name}</h3>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <hr />
        <p>${data.message.replace(/\n/g, '<br />')}</p>
      `,
    };

    // 2. Auto-reply to User (Customer)
    const userMailOptions = {
      from: `"Hezekiah Olawale Ojenike" <${adminEmail}>`,
      to: data.email,
      subject: `Re: ${data.subject} - Thank you for reaching out!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
          <h3>Hello ${data.name},</h3>
          <p>Thank you for reaching out through my portfolio. This is an automated confirmation that I have received your message regarding <strong>"${data.subject}"</strong>.</p>
          <p>I will review your message and get back to you as soon as possible.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Hezekiah Olawale Ojenike</strong><br/>Full-Stack Developer</p>
          <hr />
          <p style="font-size: 12px; color: #666;"><em>Your original message:</em><br/>${data.message.replace(/\n/g, '<br />')}</p>
        </div>
      `,
    };

    try {
      // Send both emails asynchronously
      await Promise.all([
        this.transporter.sendMail(adminMailOptions),
        this.transporter.sendMail(userMailOptions),
      ]);
      console.log('✅ Contact emails sent successfully');
    } catch (error) {
      console.error('❌ Error sending contact emails:', error);
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const adminEmail = this.configService.get<string>('EMAIL_USER');
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/admin/reset-password?token=${token}`;

    const mailOptions = {
      from: `"My Portfolio Admin" <${adminEmail}>`,
      to: email,
      subject: 'Password Reset Request - My Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563EB;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You are receiving this email because we received a password reset request for your admin account.</p>
          <p>Click the button below to reset your password. This link is valid for **1 hour**.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you did not request a password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link: <br/> ${resetUrl}</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Reset email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending reset email:', error);
      throw new Error('Could not send reset email');
    }
  }
}
