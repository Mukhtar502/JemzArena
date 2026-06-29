import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
