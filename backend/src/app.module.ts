import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { Product } from './modules/products/entities/product.entity';
import { ProductMedia } from './modules/products/entities/product-media.entity';
import { Category } from './modules/products/entities/category.entity';
import { Contact } from './modules/contacts/entities/contact.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbSsl = config.get<string>('DB_SSL');
        const useSSL = dbSsl === 'true';
        console.log('DB Config:', {
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          database: config.get<string>('DB_NAME'),
          username: '***',
          ssl: useSSL,
        });
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: Number(config.get<number>('DB_PORT', 5432)),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'postgres'),
          database: config.get<string>('DB_NAME', 'drmac'),
          entities: [Product, ProductMedia, Category, Contact],
          migrations: [],
          migrationsRun: false,
          synchronize: true,
          logging: config.get<string>('NODE_ENV') === 'development',
          ssl: useSSL ? { rejectUnauthorized: false } : false,
          extra: useSSL ? { ssl: { rejectUnauthorized: false } } : undefined,
        };
      },
    }),
    SupabaseModule,
    ProductsModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

