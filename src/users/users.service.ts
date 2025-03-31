import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {

  constructor(private readonly dbService: DatabaseService) { }

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.dbService.user.create({
      data: createUserDto
    });
  }

  async findAll() {
    return this.dbService.user.findMany();
  }

  async findOne(id: string) {
    return this.dbService.user.findUnique({ where: { id, } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.dbService.user.update({
      data: updateUserDto,
      where: { id, }
    });
  }

  async remove(id: string) {
    return this.dbService.user.delete({ where: { id, } });
  }

  async findByEmail(email: string) {
    return this.dbService.user.findUnique({ where: { email, } })
  }
}
