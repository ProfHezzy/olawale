import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column()
  category: string;

  @Column()
  level: string; // Beginner, Intermediate, Advanced, Expert

  @Column({ default: 0 })
  order: number;
}
