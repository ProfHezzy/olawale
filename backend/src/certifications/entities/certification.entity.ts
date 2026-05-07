import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('certifications')
export class Certification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  issuer: string;

  @Column()
  date: string; // e.g., "Mar 2023"

  @Column({ nullable: true })
  link: string;

  @Column({ default: 0 })
  order: number;
}
