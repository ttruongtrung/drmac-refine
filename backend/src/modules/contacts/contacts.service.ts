import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactStatus } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    const contact = this.contactsRepository.create({
      ...dto,
      status: ContactStatus.UNREAD,
    });
    return this.contactsRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return contact;
  }

  async update(id: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);
    Object.assign(contact, dto);
    return this.contactsRepository.save(contact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactsRepository.remove(contact);
  }
}
