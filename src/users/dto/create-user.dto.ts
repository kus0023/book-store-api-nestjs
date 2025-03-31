import { Role } from "@prisma/client";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {

    id?: string;

    @IsEmail({}, { message: "email should be valid email" })
    @IsNotEmpty({ message: "email should not be empty" })
    email: string;

    @IsString({ message: "name should be string" })
    @IsNotEmpty({ message: "name should not be empty" })
    name: string;

    @IsString({ message: "password should be string" })
    @IsNotEmpty({ message: "name should not be empty" })
    @IsStrongPassword({ minLength: 8, minNumbers: 1, minLowercase: 1, minSymbols: 1, minUppercase: 1 })
    password: string;

    @IsEnum(Role, { each: true })
    @IsArray()
    roles?: Role[];
}
