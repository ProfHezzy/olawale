import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  author_name: string;

  @Column({ nullable: true })
  author_email: string;

  @Column('text')
  content: string;

  @Column()
  target_type: 'blog' | 'project';

  @Column()
  target_id: string;

  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
