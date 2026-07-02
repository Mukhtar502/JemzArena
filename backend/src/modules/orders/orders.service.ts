import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GuestCheckoutDto } from './dto/guest-checkout.dto';
import {
  sendOrderConfirmationEmail,
  sendOrderWhatsAppNotification,
} from '../../utils/notification.util';
import {
  buildOrderSummary,
  sanitizeOrderResponse,
} from '../../utils/response.util';

const normalizeNotes = (notes?: string | null | unknown): string | undefined =>
  typeof notes === 'string' ? notes : undefined;

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

    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] =
      cart.items.map((item) => ({
        product: { connect: { id: item.productId } },
        quantity: item.quantity,
        price: item.product.price,
        notes: normalizeNotes((item as { notes?: string | null }).notes),
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

  async checkoutGuest(dto: GuestCheckoutDto) {
    if (!Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('Guest cart is empty');
    }

    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] =
      dto.items.map((item) => {
        const product = productMap.get(item.productId);
        if (!product || !product.available) {
          throw new BadRequestException(
            `Product not available: ${item.productId}`,
          );
        }

        return {
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          price: product.price,
          notes: normalizeNotes((item as { notes?: string | null }).notes),
        };
      });

    const total = dto.items
      .reduce((sum, item) => {
        const product = productMap.get(item.productId);
        return sum + Number(product?.price ?? 0) * item.quantity;
      }, 0)
      .toFixed(2);

    const orderCreateData: Record<string, unknown> = {
      orderNumber: this.generateOrderNumber(),
      guestName: dto.guestName,
      guestEmail: dto.guestEmail,
      guestPhone: dto.guestPhone,
      total,
      deliveryAddress: dto.deliveryAddress,
      specialInstructions: dto.specialInstructions,
      items: {
        create: orderItemsData,
      },
    };

    const order = await this.prisma.order.create({
      data: orderCreateData as Prisma.OrderCreateInput,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (dto.guestEmail) {
      sendOrderConfirmationEmail(dto.guestEmail, order);
    }
    if (dto.guestPhone) {
      sendOrderWhatsAppNotification(dto.guestPhone, order);
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

  async findAllAdmin() {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
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
