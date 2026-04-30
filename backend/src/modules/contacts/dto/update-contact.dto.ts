import { IsEnum, IsOptional } from 'class-validator';
import { ContactStatus } from '../entities/contact.entity';

export class UpdateContactDto {
  @IsEnum(ContactStatus)
  @IsOptional()
  status?: ContactStatus;
}
