import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  sendOrderConfirmationEmail,
  sendOrderWhatsAppNotification,
} from '../../utils/notification.util';
import {
  buildOrderSummary,
  sanitizeOrderResponse,
} from '../../utils/response.util';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  async checkout(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderItemsData = cart.items.map((item) => ({
      product: { connect: { id: item.productId } },
      quantity: item.quantity,
      price: item.product.price,
    }));

    const total = cart.items
      .reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
      )
      .toFixed(2);

    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        user: { connect: { id: userId } },
        total,
        deliveryAddress: dto.deliveryAddress,
        specialInstructions: dto.specialInstructions,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      sendOrderConfirmationEmail(user.email, order);
    }
    if (user?.phone) {
      sendOrderWhatsAppNotification(user.phone, order);
    }

    return buildOrderSummary(sanitizeOrderResponse(order));
  }

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return orders.map((order) =>
      buildOrderSummary(sanitizeOrderResponse(order)),
    );
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return buildOrderSummary(sanitizeOrderResponse(order));
  }
}
