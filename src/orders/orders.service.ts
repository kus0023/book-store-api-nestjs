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

    if (updateStatusTo === OrderStatus.SHIPPED)
      return (
        this.dbService.order
          .update({
            where: { id: orderId },
            data: { status: updateStatusTo, shippedOn: new Date(Date.now()) }
          })
      )



    if (updateStatusTo === OrderStatus.DELIVERED)
      return (
        this.dbService.order
          .update({
            where: { id: orderId },
            data: { status: updateStatusTo, deliveredOn: new Date(Date.now()) }
          })
      )


  }

  async placeOrder(userId: string, createOrderDto: CreateOrderDto) {
    // check if PENDING order already exist for current user
    const pendingOrderExists = await this.dbService
      .order.findFirst({ where: { userId, status: OrderStatus.PENDING } });

    if (pendingOrderExists) {
      // Then update books Id only if its not present in it
      const uniqueBookIds = this.getUniqueBookId([
        ...pendingOrderExists.bookIds,
        ...createOrderDto.bookIds
      ])

      return this.dbService
        .order
        .update({ where: { id: pendingOrderExists.id }, data: { bookIds: uniqueBookIds } })

    } else {
      // Create a new order
      return this.dbService.order.create({
        data: {
          userId: userId,
          bookIds: this.getUniqueBookId(createOrderDto.bookIds)
        }
      })

    }
  }

  async findOrderHistoryByUserId(userId: string) {
    let order = await this.dbService.order.findMany({
      where: { userId, },
      include: {
        bookData: true,
        userData: true
      }
    });

    return order;
  }

  private getUniqueBookId(args: string[]): string[] {

    let set = new Set<string>(args)
    let uniqueBookIds = Array.from(set);

    return uniqueBookIds;
  }
}
