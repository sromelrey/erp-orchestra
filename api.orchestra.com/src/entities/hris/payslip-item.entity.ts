import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Payslip } from './payslip.entity';

export enum PayslipItemType {
  EARNING = 'EARNING',
  DEDUCTION = 'DEDUCTION',
}

@Entity('payslip_items', { schema: 'hris' })
export class PayslipItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payslip_id' })
  payslipId: number;

  @ManyToOne(() => Payslip, (p: Payslip): PayslipItem[] => p.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'payslip_id' })
  payslip: Payslip;

  @Column({ type: 'enum', enum: PayslipItemType })
  type: PayslipItemType;

  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'jsonb', nullable: true })
  meta?: Record<string, unknown>;
}
