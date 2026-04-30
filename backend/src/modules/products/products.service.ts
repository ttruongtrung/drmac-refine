import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductMedia } from './entities/product-media.entity';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadProductImageDto, SetThumbnailDto } from './dto/upload-product-image.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductMedia)
    private mediaRepository: Repository<ProductMedia>,
    private supabaseService: SupabaseService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(query?: { category?: string }): Promise<Product[]> {
    const where: any = {};

    // Filter by category slug
    if (query?.category) {
      const category = await this.productsRepository.manager
        .getRepository('Category')
        .findOne({ where: { slug: query.category } });
      if (category) {
        where.categoryId = category.id;
      }
    }

    const products = await this.productsRepository.find({
      where,
      relations: ['media', 'category'],
    });

    // Add convenience thumbnailUrl to each product
    return products.map(product => {
      (product as any).thumbnailUrl = product.media?.find(m => m.isThumbnail)?.originalUrl || product.media?.[0]?.originalUrl || null;
      return product;
    });
  }

  async findOneBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ 
      where: { slug },
      relations: ['media', 'category']
    });
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    // Add a convenience field for the thumbnail/main image
    (product as any).thumbnailUrl = product.media?.find(m => m.isThumbnail)?.originalUrl || product.media?.[0]?.originalUrl || null;
    return product;
  }

  async findOneById(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['media', 'category']
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    // Add a convenience field for the thumbnail/main image
    (product as any).thumbnailUrl = product.media?.find(m => m.isThumbnail)?.originalUrl || product.media?.[0]?.originalUrl || null;
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    await this.productsRepository.remove(product);
  }

  async uploadImage(
    productId: string,
    imageDto: UploadProductImageDto,
  ): Promise<ProductMedia> {
    const product = await this.findOneById(productId);

    // If this is set as thumbnail, unset other thumbnails
    if (imageDto.isThumbnail) {
      await this.mediaRepository.update(
        { productId },
        { isThumbnail: false },
      );
    }

    const maxOrder = await this.mediaRepository
      .createQueryBuilder('media')
      .where('media.productId = :productId', { productId })
      .select('MAX(media.displayOrder)', 'max')
      .getRawOne();

    const nextOrder = (maxOrder?.max ?? -1) + 1;

    const media = this.mediaRepository.create({
      productId,
      originalUrl: imageDto.originalUrl,
      thumbnailUrl: imageDto.thumbnailUrl,
      isThumbnail: imageDto.isThumbnail || false,
      displayOrder: imageDto.displayOrder ?? nextOrder,
    });

    return this.mediaRepository.save(media);
  }

  async setProductThumbnail(
    productId: string,
    mediaId: string,
  ): Promise<ProductMedia> {
    const product = await this.findOneById(productId);

    const media = await this.mediaRepository.findOne({
      where: { id: mediaId, productId },
    });

    if (!media) {
      throw new NotFoundException(`Image #${mediaId} not found for product #${productId}`);
    }

    // Unset other thumbnails
    await this.mediaRepository.update(
      { productId },
      { isThumbnail: false },
    );

    // Set this as thumbnail
    media.isThumbnail = true;
    return this.mediaRepository.save(media);
  }

  async deleteImage(productId: string, mediaId: string): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId, productId },
    });

    if (!media) {
      throw new NotFoundException(`Image #${mediaId} not found for product #${productId}`);
    }

    // Delete from Supabase if it's a Supabase URL
    if (media.originalUrl?.includes('supabase')) {
      try {
        await this.supabaseService.deleteFile(media.originalUrl);
      } catch (err) {
        this.logger.warn(`Failed to delete file from Supabase: ${err.message}`);
      }
    }

    await this.mediaRepository.remove(media);
  }

  async getProductImages(productId: string): Promise<ProductMedia[]> {
    await this.findOneById(productId);
    return this.mediaRepository.find({
      where: { productId },
      order: { displayOrder: 'ASC' },
    });
  }
}
