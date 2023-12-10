import {Injectable} from '@nestjs/common';

import {v4 as uuidv4} from 'uuid';

import {InjectRepository} from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
import {CartEntity} from '../../database/entities/carts.entity';
import {CartStatus} from '../../enums/carts';
import {CartItemEntity} from '../../database/entities/cart-items.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async findByUserId(userId: string): Promise<CartEntity> {
    return this.cartRepository.findOne({
      where: {
        userId,
        status: CartStatus.Open,
      },
      relations: ['items', 'items.product'],
    });
  }

  async createByUserId(userId: string): Promise<CartEntity> {
    const id = uuidv4();
    const userCart = {
      id,
      userId,
      items: [],
      status: CartStatus.Open,
    };
    const cart = this.cartRepository.create(userCart);

    return this.cartRepository.save(cart);
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Partial<CartEntity>): Promise<CartEntity> {
    try {
      const cart = await this.findOrCreateByUserId(userId);

      for (const item of items) {
        console.log(`${JSON.stringify(cart)}`);
        const idx = cart.items.findIndex(
            (existsItem) => existsItem.product.id === item.product.id
        );
        if(idx >= 0) {
          cart.items[idx].count = item.count;
          await this.cartItemRepository.save(cart.items[idx]);

        } else {
          const cartItemToAdd = new CartItemEntity();
          cartItemToAdd.productId = item.product.id;
          cartItemToAdd.count = item.count;
          cartItemToAdd.cartId = cart.id;
          await this.cartItemRepository.save(cartItemToAdd);
        }
      }

      await this.cartRepository.update({ id: cart.id }, { updatedAt: new Date() });
      return this.findByUserId(userId);
    } catch (error) {
      console.error(`UpdateByUserId cart: ${JSON.stringify(error)}`)
      throw error;
    }
  }

  async removeByUserId(userId: string): Promise<DeleteResult> {
    return this.cartRepository.delete({ userId });
  }
}
