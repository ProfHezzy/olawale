import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async getProfile(): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id: 1 } });
    if (!profile) {
      // Return a default empty/fallback profile if it doesn't exist yet
      return this.profileRepository.create({
        id: 1,
        full_name: 'Your Name',
        bio: 'Your Bio',
        about_me: 'About me text...',
      });
    }
    return profile;
  }

  async updateProfile(updateData: Partial<Profile>): Promise<Profile> {
    let profile = await this.profileRepository.findOne({ where: { id: 1 } });
    
    if (!profile) {
      profile = this.profileRepository.create({ id: 1, ...updateData });
    } else {
      this.profileRepository.merge(profile, updateData);
    }
    
    return this.profileRepository.save(profile);
  }
}
