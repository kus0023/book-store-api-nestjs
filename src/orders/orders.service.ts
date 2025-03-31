import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {

  constructor(private readonly dbService: DatabaseService) { }

  getAllOrders(status?: OrderStatus) {

    return this.dbService.order.findMany({ where: { status: status } })

  }
}
