import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { OrderStatus, Role } from '@prisma/client';
import { OrderStatusValidationPipe } from './pipes/order-status.validation';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Auth(Role.ADMIN)
  @Get()
  getAllOrders(@Query('status', OrderStatusValidationPipe) status?: OrderStatus) {
    return this.ordersService.getAllOrders(status);
  }

  @Auth(Role.ADMIN)
  @Patch(":orderId")
  updateOrderStatus(
    @Param("orderId") orderId: string,
    @Body('updateStatusTo', OrderStatusValidationPipe) updateStatusTo: OrderStatus
  ) {
    return this.ordersService.updateOrderStatus(orderId, updateStatusTo)
  }

  @Auth(Role.USER)
  @Post()
  placeOrder(@Request() request, @Body() createOrderDto: CreateOrderDto) {
    const userId = request.user.id;
    return this.ordersService.placeOrder(userId, createOrderDto);
  }

  @Auth(Role.USER)
  @Get("/history")
  orderHistory(@Request() request) {
    return this.ordersService.findOrderHistoryByUserId(request.user.id);
  }

}
