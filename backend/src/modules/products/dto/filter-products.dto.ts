// DTO for filtering/paginating products

import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProductsDto {
  @ApiPropertyOptional({
    description: 'Filter products by category',
    example: 'pastries',
  })
  @IsOptional()
  @IsString()
  category?: string; // Filter by category

  @ApiPropertyOptional({
    description: 'Search products by name or description',
    example: 'meat',
  })
  @IsOptional()
  @IsString()
  search?: string; // Search by name

  @ApiPropertyOptional({
    description: 'Sort products by price or name',
    enum: ['price-asc', 'price-desc', 'name'],
    example: 'price-asc',
  })
  @IsOptional()
  @IsString()
  sort?: 'price-asc' | 'price-desc' | 'name'; // Sort order

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1; // Default page 1

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10; // Default 10 items per page
}
