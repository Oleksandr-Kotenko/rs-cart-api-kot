import { CartStatus } from '../../enums/carts';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cartId: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'json', nullable: false })
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };

  @Column({ type: 'json', nullable: false })
  delivery: {
    type: string;
    address: any;
  };

  @Column({ type: 'text' })
  comments: string;

  @Column({ type: 'enum', enum: CartStatus })
  status: CartStatus;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: false })
  total: number;

}
