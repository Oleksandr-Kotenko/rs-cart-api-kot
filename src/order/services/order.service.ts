import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Order } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../../database/entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CartStatus } from '../../enums/carts';
import { CartEntity } from '../../database/entities/carts.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    private dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<OrderEntity> {
    return this.orderRepository.findOneBy({ id });
  }

  async create(data: Order): Promise<OrderEntity> {
    const id = uuidv4();
    const order = {
      ...data,
      id,
      status: CartStatus.Open,
    };

    let result: OrderEntity;
    await this.dataSource.transaction(async() => {
      const newOrder = await this.orderRepository.create(order);
      result = await this.orderRepository.save(newOrder);
      await this.cartRepository.update(
          {id: order.cartId},
          {
            updatedAt: new Date(),
            status: CartStatus.Ordered,
          },
      );
    });

    return result;
  }

  async update(orderId: string, data): Promise<OrderEntity> {
    try {
      const order = await this.findById(orderId);

      if (!order) {
        throw new Error('Order does not exist.');
      }

      const updatedOrder = {
        ...data,
        id: orderId,
      };

      await this.dataSource.transaction(async () => {
        await this.orderRepository.update({id: orderId}, updatedOrder);
        await this.cartRepository.update(
            {id: data.cartId},
            {status: CartStatus.Ordered},
        );
      });

      return updatedOrder;
    } catch (error) {
      console.error(`Order update error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
