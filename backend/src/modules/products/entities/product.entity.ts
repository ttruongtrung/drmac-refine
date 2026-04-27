import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ProductMedia } from './product-media.entity';
import { Category } from './category.entity';

export enum ProductPublishStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export enum ProductStockStatus {
  IN_STOCK = 'in-stock',
  LOW_STOCK = 'low-stock',
  OUT_OF_STOCK = 'out-of-stock',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'USD' })
  currency: string;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @Column({
    type: 'enum',
    enum: ProductStockStatus,
    default: ProductStockStatus.IN_STOCK,
  })
  stockStatus: ProductStockStatus;

  @Column({
    type: 'enum',
    enum: ProductPublishStatus,
    default: ProductPublishStatus.DRAFT,
  })
  publishStatus: ProductPublishStatus;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, string>;

  @OneToMany(() => ProductMedia, media => media.product)
  media: ProductMedia[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
