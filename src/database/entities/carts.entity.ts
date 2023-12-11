import { CartStatus } from '../../enums/carts';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItemEntity } from './cart-items.entity';
import { UserEntity } from './users.entity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'enum', enum: CartStatus })
  status: CartStatus;

  @OneToMany(() => CartItemEntity, (item) => item.cart, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'cart_id' })
  items: CartItemEntity[];

  @ManyToOne(() => UserEntity, (user) => user.carts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
