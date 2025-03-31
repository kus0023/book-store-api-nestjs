import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    OrdersModule,
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
