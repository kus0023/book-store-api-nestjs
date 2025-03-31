import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, DatabaseService],
  exports: [BooksService]
})
export class BooksModule { }
