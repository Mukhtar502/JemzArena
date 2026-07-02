type AnyRecord = Record<string, any>;

export function sanitizeUserResponse<T extends AnyRecord>(
  user: T | null | undefined,
) {
  if (!user || typeof user !== 'object') {
    return user as T | null | undefined;
  }

  const { password, ...rest } = user as AnyRecord;
  return rest as Omit<T, 'password'>;
}

export function sanitizeOrderResponse<T extends AnyRecord>(
  order: T | null | undefined,
) {
  if (!order || typeof order !== 'object') {
    return order as T | null | undefined;
  }

  const { user, ...rest } = order as AnyRecord;
  return rest as Omit<T, 'user'>;
}

export function buildCartSummary(cart: AnyRecord | null | undefined) {
  if (!cart) {
    return {
      id: null,
      items: [],
      total: '0.00',
      itemCount: 0,
      updatedAt: null,
    };
  }

  const items = Array.isArray(cart.items) ? cart.items : [];
  const normalizedItems = items.map((item: AnyRecord) => ({
    id: item.id,
    quantity: item.quantity,
    product: item.product,
    notes: item.notes,
    subtotal: (Number(item.product?.price ?? 0) * item.quantity).toFixed(2),
  }));

  const total = normalizedItems
    .reduce((sum: number, item: AnyRecord) => sum + Number(item.subtotal), 0)
    .toFixed(2);

  return {
    id: cart.id,
    userId: cart.userId,
    items: normalizedItems,
    total,
    itemCount: normalizedItems.reduce(
      (sum: number, item: AnyRecord) => sum + item.quantity,
      0,
    ),
    updatedAt: cart.updatedAt,
  };
}

export function buildOrderSummary(order: AnyRecord | null | undefined) {
  if (!order) {
    return null;
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    total: order.total,
    status: order.status,
    deliveryAddress: order.deliveryAddress,
    specialInstructions: order.specialInstructions,
    itemCount: items.reduce(
      (sum: number, item: AnyRecord) => sum + Number(item.quantity ?? 0),
      0,
    ),
    items: items.map((item: AnyRecord) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes,
      product: item.product,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
