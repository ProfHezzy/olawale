import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}

  findAll() {
    return this.experienceRepository.find({ order: { order: 'ASC' } });
  }

  findOne(id: number) {
    return this.experienceRepository.findOne({ where: { id } });
  }

  create(data: Partial<Experience>) {
    const experience = this.experienceRepository.create(data);
    return this.experienceRepository.save(experience);
  }

  async update(id: number, data: Partial<Experience>) {
    await this.experienceRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.experienceRepository.delete(id);
  }
}
