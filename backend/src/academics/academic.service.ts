import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Academic } from './entities/academic.entity';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(Academic)
    private academicRepository: Repository<Academic>,
  ) {}

  findAll() {
    return this.academicRepository.find({ order: { order: 'ASC' } });
  }

  findOne(id: number) {
    return this.academicRepository.findOne({ where: { id } });
  }

  create(data: Partial<Academic>) {
    const academic = this.academicRepository.create(data);
    return this.academicRepository.save(academic);
  }

  async update(id: number, data: Partial<Academic>) {
    await this.academicRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.academicRepository.delete(id);
  }
}
