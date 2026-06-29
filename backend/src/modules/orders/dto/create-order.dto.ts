import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '123 Market Street, Springfield' })
  @IsString()
  deliveryAddress!: string;

  @ApiPropertyOptional({ example: 'Leave at the front desk' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
