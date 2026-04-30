import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // Public: Storefront contact form submission
  @Post('contacts')
  create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  // Admin: Get all contacts
  @Get('admin/contacts')
  findAll() {
    return this.contactsService.findAll();
  }

  // Admin: Get single contact
  @Get('admin/contacts/:id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  // Admin: Update contact status (mark as read)
  @Patch('admin/contacts/:id')
  update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactsService.update(id, dto);
  }

  // Admin: Delete contact
  @Delete('admin/contacts/:id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
