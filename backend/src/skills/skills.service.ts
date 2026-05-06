import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async findAll() {
    return this.skillsRepository.find({ order: { order: 'ASC' } });
  }

  async create(data: Partial<Skill>) {
    const skill = this.skillsRepository.create(data);
    return this.skillsRepository.save(skill);
  }

  async update(id: string, data: Partial<Skill>) {
    await this.skillsRepository.update(id, data);
    return this.skillsRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    return this.skillsRepository.delete(id);
  }
}
