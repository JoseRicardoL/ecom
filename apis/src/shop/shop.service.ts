import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';
import { Shop } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ShopService {

  private readonly logger = new Logger('ShopService');

  constructor(

    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,

    private readonly dataSource: DataSource,

  ) {}

  async create(createShopDto: CreateShopDto, user: User) {
    try {

      const { ...shopDetails } = createShopDto;

      const shop = this.shopRepository.create({
        ...shopDetails,
        user,
      });

      await this.shopRepository.save( shop );

      return { ...shop };

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const shops = await this.shopRepository.find({
      take: limit,
      skip: offset
    })

    return shops.map( ( shop ) => ({
      ...shop
    }))
  }

  async findOne( term: string ) {

    let shop: Shop;

    if ( isUUID(term) ) {
      shop = await this.shopRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.shopRepository.createQueryBuilder('prod'); 
      shop = await queryBuilder
        .where('UPPER(name) =:name', {
          name: term.toUpperCase()
        })
        .getOne();
    }
    if ( !shop ) 
      throw new NotFoundException(`Shop with ${ term } not found`);

    return shop;
  }

  async findOnePlain( term: string ) {
    const { ...rest } = await this.findOne( term );
    return {
      ...rest
    }
  }

  async update( id: string, updateShopDto: UpdateShopDto, user: User ) {

    const {...toUpdate } = updateShopDto;


    const shop = await this.shopRepository.preload({ id, ...toUpdate });

    if ( !shop ) throw new NotFoundException(`Shop with id: ${ id } not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      shop.user = user;
      await queryRunner.manager.save( shop );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain( id );
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const shop = await this.findOne( id );
    await this.shopRepository.remove( shop );
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
