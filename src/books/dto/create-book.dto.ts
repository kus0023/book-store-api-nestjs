import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator";

export class CreateBookDto {
    id: string;

    @IsString({ message: "title should be string" })
    @IsNotEmpty({ message: "title should not be empty" })
    title: string;

    @IsString({ message: "author should be string" })
    @IsNotEmpty({ message: "author should not be empty" })
    author: string;

    @IsArray({ message: "genre should be array of string" })
    @IsString({ each: true, message: "genre should be of string type array" })
    @ArrayMinSize(1, { message: "genre array cannot be empty" })
    genre: string[];

    @IsPositive({ message: "price should be positive integer" })
    @IsNotEmpty({ message: "price should not be empty" })
    price: number;

    @IsNotEmpty({ message: "stock should not be empty" })
    @Min(0, { message: "Min value of stock is 0" })
    stock: number;
}