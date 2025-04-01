import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseService } from 'src/database/database.service';
import { BookSearchAndFilterController } from './book-search.controller';

@Module({
  controllers: [BookSearchAndFilterController, BooksController],
  providers: [BooksService, DatabaseService],
  exports: [BooksService]
})
export class BooksModule { }
