import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll() {
    return this.projectsRepository.find({ order: { created_at: 'DESC' } });
  }

  async findFeatured() {
    return this.projectsRepository.find({
      where: { featured: true },
      order: { created_at: 'DESC' },
    });
  }

  async findBySlug(slug: string) {
    const project = await this.projectsRepository.findOne({ where: { slug } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(data: Partial<Project>) {
    const project = this.projectsRepository.create(data);
    return this.projectsRepository.save(project);
  }

  async update(id: string, data: Partial<Project>) {
    await this.projectsRepository.update(id, data);
    return this.projectsRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    return this.projectsRepository.delete(id);
  }

  async like(id: string) {
    await this.projectsRepository.increment({ id }, 'likes', 1);
    return this.projectsRepository.findOne({ where: { id } });
  }

  async share(id: string) {
    await this.projectsRepository.increment({ id }, 'shares', 1);
    return this.projectsRepository.findOne({ where: { id } });
  }
}
