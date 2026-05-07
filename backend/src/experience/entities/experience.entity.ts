import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('experience')
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  period: string; // e.g., "Jan 2020 - Present"

  @Column('text')
  description: string;

  @Column({ default: 0 })
  order: number;
}
