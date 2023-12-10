import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CartEntity } from './carts.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'cart_items' })
export class CartItemEntity {
  @PrimaryColumn({ type: 'uuid' })
  cartId: string;

  @PrimaryColumn({ type: 'uuid' })
  productId: string;

  @Column({ type: 'integer' })
  count: number;

  @ManyToOne(() => CartEntity, (card) => card.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductEntity;
}
