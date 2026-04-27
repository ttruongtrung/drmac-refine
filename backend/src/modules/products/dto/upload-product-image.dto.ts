import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UploadProductImageDto {
  @IsString()
  @IsOptional()
  originalUrl?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsBoolean()
  @IsOptional()
  isThumbnail?: boolean;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}

export class SetThumbnailDto {
  @IsString()
  mediaId: string;
}
