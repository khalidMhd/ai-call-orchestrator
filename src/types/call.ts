// src/types/call.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Call {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'jsonb' })
  payload!: {
    to: string
    scriptId: string
    metadata?: Record<string, any>
  }

  @Column({ default: 'PENDING' })
  status!: 'PENDING' | 'IN_PROGRESS' | 'FAILED' | 'COMPLETED'

  @Column({ default: 0 })
  attempts!: number

  @Column({ nullable: true })
  lastError?: string

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
