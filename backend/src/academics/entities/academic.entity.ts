import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('academics')
export class Academic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  institution: string;

  @Column()
  degree: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  period: string; // e.g., "2015 - 2019"

  @Column({ nullable: true })
  grade: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;
}
