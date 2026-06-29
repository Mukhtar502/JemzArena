import { Order } from '@prisma/client';

export function sendOrderConfirmationEmail(email: string, order: Order) {
  console.log('Sending order confirmation email to:', email);
  console.log('Order Number:', order.orderNumber);
  console.log('Total:', order.total);
  console.log('Delivery Address:', order.deliveryAddress);
}

export function sendOrderWhatsAppNotification(phone: string, order: Order) {
  console.log('Sending WhatsApp order notification to:', phone);
  console.log('Order Number:', order.orderNumber);
  console.log('Total:', order.total);
}
