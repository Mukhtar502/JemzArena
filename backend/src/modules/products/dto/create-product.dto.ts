// DTO = Data Transfer Object for creating new products
// Validates and transforms incoming data

import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Mini Fruit Tart' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Sweet pastry topped with fresh berries' })
  @IsString()
  description!: string;

  @ApiProperty({ example: '19.99' })
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'Price must be a valid decimal (e.g., 19.99)',
  })
  price!: string; // Store as string, Prisma converts to Decimal

  @ApiProperty({ example: 'https://example.com/images/tart.jpg' })
  @IsString()
  image!: string; // URL to product image

  @ApiProperty({ example: 'pastries' })
  @IsString()
  category!: string; // "pastries", "chops", "platters", etc

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  available?: boolean;
}
