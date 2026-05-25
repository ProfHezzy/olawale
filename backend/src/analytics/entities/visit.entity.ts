import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ip_hash' })
  @Index()
  ipHash: string;

  @Column()
  @Index()
  path: string;

  @Column({ default: 'Direct' })
  referrer: string;

  @Column({ default: 'Unknown' })
  browser: string;

  @Column({ default: 'Unknown' })
  os: string;

  @Column({ default: 'Desktop' })
  device: string;

  @Column({ default: 'Unknown' })
  country: string;

  @CreateDateColumn({ name: 'timestamp', type: 'timestamp' })
  @Index()
  timestamp: Date;
}
