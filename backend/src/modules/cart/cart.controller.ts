import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cart')
@ApiBearerAuth('JWT')
@Controller('api/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'User cart returned' })
  async getCart(@Req() req: Request & { user?: { sub: string } }) {
    const userId = req.user?.sub;
    return this.cartService.getCart(userId!);
  }

  @Post()
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  async addItem(
    @Req() req: Request & { user?: { sub: string } },
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    const userId = req.user?.sub;
    return this.cartService.addItem(userId!, addCartItemDto);
  }

  @Put(':itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated' })
  async updateItem(
    @Req() req: Request & { user?: { sub: string } },
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const userId = req.user?.sub;
    return this.cartService.updateItem(userId!, itemId, updateCartItemDto);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({ status: 200, description: 'Cart item removed' })
  async removeItem(
    @Req() req: Request & { user?: { sub: string } },
    @Param('itemId') itemId: string,
  ) {
    const userId = req.user?.sub;
    return this.cartService.removeItem(userId!, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the current cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  async clearCart(@Req() req: Request & { user?: { sub: string } }) {
    const userId = req.user?.sub;
    return this.cartService.clearCart(userId!);
  }
}
