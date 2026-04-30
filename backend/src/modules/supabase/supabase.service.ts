import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient | null;
  private readonly logger = new Logger(SupabaseService.name);
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY') || this.configService.get<string>('SUPABASE_PUBLISHABLE_KEY');
    this.bucketName = this.configService.get<string>('SUPABASE_BUCKET') || this.configService.get<string>('SUPABASE_BUCKET_NAME', 'product-images');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn(
        'SUPABASE_URL or SUPABASE_SERVICE_KEY not set. File uploads will fall back to local disk storage.',
      );
      this.supabase = null;
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.ensureBucket();
    }
  }

  private async ensureBucket() {
    if (!this.supabase) return;
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === this.bucketName);
      if (!exists) {
        await this.supabase.storage.createBucket(this.bucketName, {
          public: true,
        });
        this.logger.log(`Created public bucket "${this.bucketName}"`);
      }
    } catch (err) {
      this.logger.error(`Failed to ensure bucket "${this.bucketName}"`, err);
    }
  }

  get isAvailable(): boolean {
    return this.supabase !== null;
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    if (!this.supabase) {
      throw new Error('Supabase is not configured');
    }

    const filePath = `${Date.now()}-${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    // Get the public URL
    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  async deleteFile(publicUrl: string): Promise<void> {
    if (!this.supabase) return;

    // Extract file path from public URL
    try {
      const url = new URL(publicUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts[pathParts.length - 1];

      await this.supabase.storage.from(this.bucketName).remove([filePath]);
    } catch {
      this.logger.warn(`Could not extract file path from URL: ${publicUrl}`);
    }
  }
}
