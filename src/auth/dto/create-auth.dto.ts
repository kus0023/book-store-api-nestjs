import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword(
        { minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
        { message: "Password require: minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1" }
    )
    @IsString()
    password: string;
}
