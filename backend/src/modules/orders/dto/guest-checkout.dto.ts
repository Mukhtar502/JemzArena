import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GuestOrderItemDto {
  @ApiProperty({ example: 'product-uuid-here' })
  @IsString()
  productId!: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({ example: 'No onions, extra rice' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class GuestCheckoutDto {
  @ApiProperty({ example: '123 Market Street, Springfield' })
  @IsString()
  deliveryAddress!: string;

  @ApiPropertyOptional({ example: 'Leave at the front desk' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({ example: 'Aaliyah James' })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiPropertyOptional({ example: 'guest@example.com' })
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @ApiPropertyOptional({ example: '+15551234567' })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiProperty({ type: [GuestOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestOrderItemDto)
  items!: GuestOrderItemDto[];
}
