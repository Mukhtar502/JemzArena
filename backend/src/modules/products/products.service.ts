import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Create new product (admin only)
  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price, // Prisma converts string to Decimal automatically
        image: createProductDto.image,
        category: createProductDto.category,
        available: createProductDto.available ?? true,
      },
    });
  }

  // Get all products with filtering and pagination
  async findAll(filterDto: FilterProductsDto) {
    const { category, search, sort, page = 1, limit = 10 } = filterDto;

    // Build where clause for filtering
    // Prisma query objects require 'any' type due to dynamic where clause structure
    const where: any = {};

    if (category) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.category = category;
    }

    if (search) {
      // Search in name or description (case-insensitive)
      // Prisma dynamic query structure requires dynamic property assignment
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build order by clause for sorting
    // Prisma orderBy accepts dynamic fields based on schema, requires 'any' type
    let orderBy: any = { createdAt: 'desc' }; // Default: newest first

    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name') {
      orderBy = { name: 'asc' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products and total count for pagination info
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        orderBy,
        skip,
        take: limit,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get single product by ID
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // Get all unique categories
  async getCategories() {
    const categories = await this.prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return categories.map((item) => item.category);
  }

  // Get featured/popular products (first 8)
  async getFeatured() {
    return await this.prisma.product.findMany({
      where: { available: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update product (admin only)
  async update(id: string, updateProductDto: UpdateProductDto) {
    // Check if product exists
    await this.findOne(id);

    // Prisma will convert price string to Decimal automatically if provided
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  // Delete product (admin only)
  async remove(id: string) {
    // Check if product exists
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}
