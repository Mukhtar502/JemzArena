// Root Module = Orchestrates all other modules
// This imports all feature modules into the application

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes .env available everywhere
    }),
    DatabaseModule,
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
  ],
  controllers: [],
})
export class AppModule {}
