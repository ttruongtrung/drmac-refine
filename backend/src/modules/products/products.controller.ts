import { Controller, Get, Post, Body, Put, Param, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadProductImageDto, SetThumbnailDto } from './dto/upload-product-image.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extname(file.originalname)}`;
          cb(null, name);
        },
      }),
    }),
  )
  uploadImage(
    @Param('id') productId: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() imageDto?: UploadProductImageDto,
  ) {
    const uploadedPath = file ? `/uploads/products/${file.filename}` : (imageDto?.originalUrl || '');
    const dto: UploadProductImageDto = {
      originalUrl: uploadedPath,
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
