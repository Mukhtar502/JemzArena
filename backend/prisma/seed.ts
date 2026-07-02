import 'dotenv/config';
import { PrismaService } from '../src/database/prisma.service';
import { BcryptUtil } from '../src/utils/bcrypt.util';

const prisma = new PrismaService();

const makeProductImage = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
    <rect width="100%" height="100%" fill="#f8f1e7" />
    <rect x="24" y="24" width="592" height="432" rx="24" fill="#fffaf3" stroke="#d9b17f" stroke-width="4" />
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="30" font-weight="700" text-anchor="middle" fill="#7a3b1d">${label}</text>
  </svg>`)}`;

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-locally';

  const products = [
    {
      name: 'Meat Pie',
      description:
        'Delicious homemade meat pie with tender beef and crisp pastry.',
      price: '15.99',
      image: makeProductImage('Meat Pie'),
      category: 'pastries',
      available: true,
    },
    {
      name: 'Spring Roll',
      description:
        'Crispy vegetable spring roll with sweet chili dipping sauce.',
      price: '8.50',
      image: makeProductImage('Spring Roll'),
      category: 'rolls',
      available: true,
    },
    {
      name: 'Samosa',
      description: 'Golden fried samosa stuffed with spiced potatoes and peas.',
      price: '5.99',
      image: makeProductImage('Samosa'),
      category: 'pastries',
      available: true,
    },
    {
      name: 'Jollof Rice',
      description: 'Savory jollof rice served with chicken and plantains.',
      price: '12.99',
      image: makeProductImage('Jollof Rice'),
      category: 'main meal',
      available: true,
    },
    {
      name: 'Beef Suya',
      description: 'Spicy grilled beef skewers served with onions and pepper.',
      price: '9.99',
      image: makeProductImage('Beef Suya'),
      category: 'chops',
      available: true,
    },
  ];

  await prisma.$connect();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });

  const hashedPassword = await BcryptUtil.hashPassword(adminPassword);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+15550000000',
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+15550000000',
    },
  });

  console.log(`Seeded ${products.length} products`);
  console.log(`Admin login: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
