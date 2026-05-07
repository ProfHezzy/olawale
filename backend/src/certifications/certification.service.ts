import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification } from './entities/certification.entity';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(Certification)
    private certificationRepository: Repository<Certification>,
  ) {}

  findAll() {
    return this.certificationRepository.find({ order: { order: 'ASC' } });
  }

  findOne(id: number) {
    return this.certificationRepository.findOne({ where: { id } });
  }

  create(data: Partial<Certification>) {
    const certification = this.certificationRepository.create(data);
    return this.certificationRepository.save(certification);
  }

  async update(id: number, data: Partial<Certification>) {
    await this.certificationRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.certificationRepository.delete(id);
  }
}
