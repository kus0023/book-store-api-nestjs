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
    // Check if provided Book id is valid And is in Stock
    const bookExists = await this.dbService
      .book.findFirst({ where: { id: createOrderDto.bookId } });
    if (!bookExists) throw new BadRequestException("Provided book id to update is not valid")
    if (bookExists.stock === 0) {
      throw new NotAcceptableException("Book is out of stock")
    }
    // check if PENDING order already exist for current user
    const pendingOrderExists = await this.dbService
      .order.findFirst({ where: { userId, status: OrderStatus.PENDING } });

    if (pendingOrderExists) {
      // Check if bookId to add is already present in existing order

      if (pendingOrderExists.bookIds.find((id) => createOrderDto.bookId === id)) {
        throw new NotAcceptableException({
          orderId: pendingOrderExists.id,
          description: "BookId already present in the Pending order"
        })
      }

      // If not present then update bookId in order and update stock of bookId 
      const { order, book } = this.dbService;

      return this.dbService.$transaction([
        order
          .update({
            where: { id: pendingOrderExists.id },
            data: { bookIds: { push: createOrderDto.bookId } }
          }),
        book
          .update({ where: { id: createOrderDto.bookId }, data: { stock: { decrement: 1 } } })
      ])

    } else {
      // Create a new order and update book stock
      const { order, book } = this.dbService;
      return this.dbService.$transaction([
        order
          .create({ data: { userId: userId, bookIds: { set: [createOrderDto.bookId] } } }),
        book
          .update({ where: { id: createOrderDto.bookId }, data: { stock: { decrement: 1 } } })
      ])

    }
  }

  async findOrderHistoryByUserId(userId: string) {
    let order = await this.dbService.order.findMany({
      where: { userId, },
      include: {
        bookData: true,
        userData: {
          omit: {
            password: true,
            createAt: true,
            updatedAt: true,
            id: true
          }
        }
      },
    });

    return order;
  }

  private getUniqueBookId(args: string[]): string[] {

    let set = new Set<string>(args)
    let uniqueBookIds = Array.from(set);

    return uniqueBookIds;
  }
}
