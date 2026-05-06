import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column()
  bio: string;

  @Column('text')
  about_me: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  github_url: string;

  @Column({ nullable: true })
  linkedin_url: string;

  @Column({ nullable: true })
  twitter_url: string;

  @Column({ nullable: true })
  resume_url: string;

  @Column({ default: '5+' })
  years_experience: string;

  @Column({ default: '40+' })
  projects_completed: string;

  @Column({ default: '100+' })
  students_taught: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  about_image_url: string;

  @UpdateDateColumn()
  updated_at: Date;
}
