import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsObject } from 'class-validator';
import { ProductPublishStatus, ProductStockStatus } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsEnum(ProductStockStatus)
  @IsOptional()
  stockStatus?: ProductStockStatus;

  @IsEnum(ProductPublishStatus)
  @IsOptional()
  publishStatus?: ProductPublishStatus;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>;
}
