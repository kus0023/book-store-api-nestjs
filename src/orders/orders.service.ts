import { BadRequestException, HttpException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {

  constructor(private readonly dbService: DatabaseService) { }

  async getAllOrders(status?: OrderStatus) {

    return this.dbService.order.findMany({ where: { status: status } })

  }

  async updateOrderStatus(orderId: string, updateStatusTo: OrderStatus) {

    let order = await this.dbService.order.findUnique({ where: { id: orderId } });

    if (!order) throw new NotFoundException(`Order with id=${orderId} not found.`)

    if (order.status === updateStatusTo) {
      return order;
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new NotAcceptableException("Order already delivered.")
    }
    if (order.status === OrderStatus.SHIPPED && updateStatusTo === OrderStatus.PENDING) {
      throw new NotAcceptableException("Order already Shipped. Cannot update order status to Pending")
    }

    if (order.status === OrderStatus.PENDING && updateStatusTo === OrderStatus.DELIVERED) {
      throw new NotAcceptableException("Order is in Pending state. Cannot update order status to Deliver")
    }

    return this.dbService.order.update({ where: { id: orderId }, data: { status: updateStatusTo } })
  }
}
