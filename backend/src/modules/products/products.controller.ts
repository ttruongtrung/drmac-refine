import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadProductImageDto, SetThumbnailDto } from './dto/upload-product-image.dto';

@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly supabaseService: SupabaseService,
  ) {}

  // Public Endpoints
  @Get('products')
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('products/:slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  // Admin Endpoints
  @Post('admin/products')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('admin/products/:id')
  findOneById(@Param('id') id: string) {
    return this.productsService.findOneById(id);
  }

  @Put('admin/products/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('admin/products/:id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // Image Management Endpoints
  @Post('admin/products/:id/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') productId: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() imageDto?: UploadProductImageDto,
  ) {
    let originalUrl = imageDto?.originalUrl || '';

    if (file) {
      if (this.supabaseService.isAvailable) {
        // Upload to Supabase bucket
        originalUrl = await this.supabaseService.uploadFile(
          file.buffer,
          `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extname(file.originalname)}`,
          file.mimetype,
        );
      } else {
        // Fallback: local disk storage
        const fs = await import('fs');
        const path = await import('path');
        const uploadDir = './uploads/products';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extname(file.originalname)}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        originalUrl = `/uploads/products/${fileName}`;
      }
    }

    const dto: UploadProductImageDto = {
      originalUrl,
      thumbnailUrl: imageDto?.thumbnailUrl,
      isThumbnail: imageDto?.isThumbnail,
      displayOrder: imageDto?.displayOrder,
    };

    return this.productsService.uploadImage(productId, dto);
  }

  @Get('admin/products/:id/images')
  getProductImages(@Param('id') productId: string) {
    return this.productsService.getProductImages(productId);
  }

  @Put('admin/products/:id/images/:mediaId/thumbnail')
  setThumbnail(
    @Param('id') productId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.productsService.setProductThumbnail(productId, mediaId);
  }

  @Delete('admin/products/:id/images/:mediaId')
  deleteImage(
    @Param('id') productId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.productsService.deleteImage(productId, mediaId);
  }
}

