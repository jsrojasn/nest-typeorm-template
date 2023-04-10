import {
    IsNumber, IsOptional,
    IsPositive, IsString, MinLength
} from 'class-validator';


export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    @MinLength(1)
    @IsOptional()
    description?: string;
}
