import { OrderStatus } from "@prisma/client";
import { ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, } from "class-validator";

export class CreateOrderDto {

    @IsOptional()
    id?: string;

    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @IsString()
    @IsNotEmpty()
    bookId: string;

    @IsOptional()
    @IsString()
    userId: string;
}
