import { IsString, IsNumber, IsOptional, IsEnum, IsUUID } from 'class-validator';

export enum ProductStatus {
  IN_STOCK = 'in-stock',
  COMING_SOON = 'coming-soon',
  ARCHIVED = 'archived',
}

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
  currency: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsEnum(ProductStatus)
  status: ProductStatus;
}
