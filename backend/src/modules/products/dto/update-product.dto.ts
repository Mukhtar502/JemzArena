import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// PartialType makes all fields optional (perfect for PATCH/PUT)
// @nestjs/mapped-types PartialType has incomplete type definitions in the library
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateProductDto extends PartialType(CreateProductDto) {
  // All fields from CreateProductDto but optional
}
