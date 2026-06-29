import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { buildCartSummary } from 'src/utils/response.util';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    const existingCart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (existingCart) {
      return existingCart;
    }

    return this.prisma.cart.create({
      data: {
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      return buildCartSummary({
        id: null,
        userId,
        items: [],
        updatedAt: null,
      });
    }

    return buildCartSummary({
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product,
      })),
      updatedAt: cart.updatedAt,
    });
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product || !product.available) {
      throw new BadRequestException('Product not available');
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      cartItem = await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + dto.quantity,
        },
        include: { product: true },
      });
    } else {
      cartItem = await this.prisma.cartItem.create({
        data: {
          cart: { connect: { id: cart.id } },
          product: { connect: { id: dto.productId } },
          quantity: dto.quantity,
        },
        include: { product: true },
      });
    }

    const refreshedCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });

    return {
      message: 'Item added to cart successfully',
      item: cartItem,
      cart: buildCartSummary(refreshedCart),
    };
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const existingItem = cart.items.find((item) => item.id === itemId);
    if (!existingItem) {
      throw new NotFoundException('Cart item not found');
    }

    const cartItem = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
      include: { product: true },
    });

    const refreshedCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });

    return {
      message: 'Cart item updated successfully',
      item: cartItem,
      cart: buildCartSummary(refreshedCart),
    };
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const existingItem = cart.items.find((item) => item.id === itemId);
    if (!existingItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });

    const refreshedCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });

    return {
      message: 'Cart item removed successfully',
      cart: buildCartSummary(refreshedCart),
    };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return { message: 'Cart is already empty' };
    }

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return {
      message: 'Cart cleared successfully',
      cart: buildCartSummary({
        id: cart.id,
        userId: cart.userId,
        items: [],
        updatedAt: new Date(),
      }),
    };
  }
}
