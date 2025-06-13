import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
export abstract class CustomBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'created_at',
  })
  createdAt: string;
  @UpdateDateColumn({
    nullable: true,
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: string;
}
