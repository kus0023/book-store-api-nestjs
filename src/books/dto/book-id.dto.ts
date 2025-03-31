import { IsHexadecimal } from "class-validator";

export class HexBookIdDto {
    @IsHexadecimal({ message: "Id should be Hexadecimal" })
    id: string;
}