import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartEntity } from './carts.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @OneToMany(() => CartEntity, (cart) => cart.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  carts: CartEntity[];

}
