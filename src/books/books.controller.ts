import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, DefaultValuePipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-boook.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '@prisma/client';

@Controller('books')
@Auth(Role.ADMIN)
export class BooksController {

  constructor(private readonly booksService: BooksService) { }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @Auth(Role.USER)
  findAll(
    @Query('skip', new DefaultValuePipe(0)) skip: number,
    @Query('take', new DefaultValuePipe(10)) take: number,
    @Query('title') title: string
  ) {
    const books = this.booksService.findAll(+skip, +take, title);
    if (!books) throw new NotFoundException();
    return books;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const book = this.booksService.findOne(id);
    if (!book) throw new NotFoundException();
    return book;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
