import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column('simple-array')
  tech_stack: string[];

  @Column({ nullable: true })
  github_url: string;

  @Column({ nullable: true })
  live_url: string;

  @Column()
  category: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  shares: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
