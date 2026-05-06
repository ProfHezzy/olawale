import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
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
      // We don't want to throw and fail the contact form submission if emails fail
      // but it's good to log it.
    }
  }
}
