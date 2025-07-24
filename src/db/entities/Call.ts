import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn
} from 'typeorm'

export type CallStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'EXPIRED'

@Entity()
export class Call {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('jsonb')
  payload!: { to: string; scriptId: string; metadata?: Record<string, any> }

  @Column({ type: 'varchar' })
  status!: CallStatus

  @Column({ default: 0 })
  attempts!: number

  @Column({ nullable: true })
  lastError?: string

  @CreateDateColumn()
  createdAt!: Date

  @Column({ nullable: true })
  startedAt?: Date

  @Column({ nullable: true })
  endedAt?: Date
}
