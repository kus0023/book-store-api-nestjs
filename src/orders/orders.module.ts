import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [UsersModule, BooksModule,],
  controllers: [OrdersController],
  providers: [OrdersService, DatabaseService],
})
export class OrdersModule { }
