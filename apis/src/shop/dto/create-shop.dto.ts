import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional,
    IsString,
    MinLength
} from 'class-validator';

export class CreateShopDto {

    @ApiProperty({
        description: 'Shop name (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;
}
