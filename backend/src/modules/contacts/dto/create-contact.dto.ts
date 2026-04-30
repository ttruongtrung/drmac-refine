import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @MinLength(10)
  message: string;
}
