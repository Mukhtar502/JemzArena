import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // GET /api/products - Get all products with filtering/pagination
  @Get()
  @ApiOperation({ summary: 'List products with optional filters' })
  @ApiResponse({ status: 200, description: 'Product list returned' })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    example: 'pastries',
  })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'meat' })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['price-asc', 'price-desc', 'name'],
    example: 'price-asc',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAll(@Query() filterDto: FilterProductsDto) {
    return this.productsService.findAll(filterDto);
  }

  // GET /api/products/categories - Get all unique categories
  @Get('categories')
  @ApiOperation({ summary: 'Get all distinct product categories' })
  @ApiResponse({ status: 200, description: 'Categories returned' })
  async getCategories() {
    return this.productsService.getCategories();
  }

  // GET /api/products/featured - Get featured products
  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, description: 'Featured products returned' })
  async getFeatured() {
    return this.productsService.getFeatured();
  }

  // GET /api/products/:id - Get single product
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product returned' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // POST /api/products - Create product (admin only)
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // PUT /api/products/:id - Update product (admin only)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE /api/products/:id - Delete product (admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
