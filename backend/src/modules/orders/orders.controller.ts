import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request as Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth('JWT')
@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout user cart and create an order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async checkout(
    @Req() req: Request & { user?: { sub: string } },
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const userId = req.user?.sub;
    return this.ordersService.checkout(userId!, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for the current user' })
  @ApiResponse({ status: 200, description: 'Orders returned' })
  async getOrders(@Req() req: Request & { user?: { sub: string } }) {
    const userId = req.user?.sub;
    return this.ordersService.findAll(userId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific order' })
  @ApiResponse({ status: 200, description: 'Order details returned' })
  async getOrder(
    @Req() req: Request & { user?: { sub: string } },
    @Param('id') id: string,
  ) {
    const userId = req.user?.sub;
    return this.ordersService.findOne(userId!, id);
  }
}
