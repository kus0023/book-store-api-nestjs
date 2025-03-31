import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BooksService {

  constructor(private readonly dbService: DatabaseService) { }

  create(createBookDto: Prisma.BookCreateInput) {
    return this.dbService.book.create({
      data: createBookDto,
    });
  }

  findAll(skip: number, take: number, title: string) {
    if (title) {
      return this.dbService.book.findMany({
        skip, take, where: {
          title,
        }
      });
    } else {
      return this.dbService.book.findMany({ skip, take, });
    }

  }

  findOne(id: string) {
    return this.dbService.book.findFirst({ where: { id, } });
  }

  update(id: string, updateBookDto: Prisma.BookUpdateInput) {
    return this.dbService.book.update({ where: { id, }, data: updateBookDto });
  }

  remove(id: string) {
    return `This action removes a #${id} book`;
  }
}
