import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Shop } from './entities/shop.entity';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';

import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  @Auth()
  @ApiResponse({ status: 201, description: 'Shop was created', type: Shop  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  create(
    @Body() createShopDto: CreateShopDto,
    @GetUser() user: User,
  ) {
    return this.shopService.create(createShopDto, user );
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.shopService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShopDto: UpdateShopDto,
    @GetUser() user: User,
    ) {
    return this.shopService.update(id, updateShopDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.shopService.remove(id);
  }
}
