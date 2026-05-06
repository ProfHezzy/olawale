import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private mailService: MailService,
  ) {}

  async findAll() {
    return this.messagesRepository.find({ order: { created_at: 'DESC' } });
  }

  async create(data: Partial<Message>) {
    const message = this.messagesRepository.create(data);
    const savedMessage = await this.messagesRepository.save(message);

    // Fire and forget email sending
    if (data.name && data.email && data.subject && data.message) {
      this.mailService.sendContactEmails({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
    }

    return savedMessage;
  }

  async markAsRead(id: string) {
    await this.messagesRepository.update(id, { read: true });
    return this.messagesRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    return this.messagesRepository.delete(id);
  }
}
