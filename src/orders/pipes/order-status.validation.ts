import { BadRequestException, PipeTransform } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { isDefined, isEnum } from 'class-validator';

export class OrderStatusValidationPipe implements PipeTransform<string, Promise<OrderStatus>> {

    transform(value: string): Promise<OrderStatus> {
        if (isDefined(value) && isEnum(value, OrderStatus)) {
            return OrderStatus[value];
        } else {
            const errorMessage = `the value ${value} is not valid. See the acceptable values: ${Object.keys(
                OrderStatus
            ).map(key => OrderStatus[key])}`;
            throw new BadRequestException(errorMessage);
        }
    }
}