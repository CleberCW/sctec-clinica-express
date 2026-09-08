import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Role } from './role.entity.ts';

@Entity()
@Unique('UQ_USER_EMAIL', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  firstName!: string;

  @Column({ type: 'varchar', nullable: false })
  lastName!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  hashedPassword!: string;

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  roles!: Role[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date;
}
