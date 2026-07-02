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
import { GuestCheckoutDto } from './dto/guest-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@ApiTags('Orders')
@ApiBearerAuth('JWT')
@Controller('api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Checkout user cart and create an order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async checkout(
    @Req() req: Request & { user?: { sub: string } },
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const userId = req.user?.sub;
    return this.ordersService.checkout(userId!, createOrderDto);
  }

  @Post('guest-checkout')
  @ApiOperation({ summary: 'Checkout as a guest and create an order' })
  @ApiResponse({ status: 201, description: 'Guest order created successfully' })
  async guestCheckout(@Body() guestCheckoutDto: GuestCheckoutDto) {
    return this.ordersService.checkoutGuest(guestCheckoutDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all orders for the current user' })
  @ApiResponse({ status: 200, description: 'Orders returned' })
  async getOrders(@Req() req: Request & { user?: { sub: string } }) {
    const userId = req.user?.sub;
    return this.ordersService.findAll(userId!);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all orders in the system (admin only)' })
  @ApiResponse({ status: 200, description: 'All orders returned' })
  async getAllOrdersAdmin() {
    return this.ordersService.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
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
