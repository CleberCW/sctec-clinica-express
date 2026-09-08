import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permissions.entity.ts';
import { User } from './user.entity.ts';

const ROLE_NAMES = ['admin', 'user', 'owner'] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions!: Permission[];

  @Column({
    type: 'enum',
    enum: ROLE_NAMES,
  })
  name!: RoleName;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date;
}
