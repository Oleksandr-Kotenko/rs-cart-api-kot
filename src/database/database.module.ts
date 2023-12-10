import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/carts.entity';
import { CartItemEntity } from './entities/cart-items.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ProductEntity } from './entities/product.entity';
import { UserEntity } from './entities/users.entity';
import { OrderEntity } from './entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_DB_HOST,
      port: +process.env.PG_DB_PORT,
      username: process.env.PG_DB_USERNAME,
      password: process.env.PG_DB_PASSWORD,
      database: process.env.PG_DB_NAME,
      entities: [
        CartEntity,
        CartItemEntity,
        ProductEntity,
        UserEntity,
        OrderEntity,
      ],
      ssl: {
        rejectUnauthorized: false,
      },
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
    }),
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      ProductEntity,
      UserEntity,
      OrderEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
