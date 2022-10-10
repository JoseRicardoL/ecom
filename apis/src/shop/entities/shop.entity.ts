import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../auth/entities/user.entity';
import { Product } from 'src/products/entities';

@Entity({ name: 'shop' })
export class Shop {
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Shop ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Groundhog',
        description: 'Shop Name',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    name: string;

    @ApiProperty({
        example: 'Retailer',
        description: 'Shop description',
        default: null,
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ManyToOne(
        () => User,
        ( user ) => user.shop,
        { eager: true }
    )
    user: User

    @OneToMany(
        () => Product,
        ( product ) => product.shop
    )
    product: Product;
}
