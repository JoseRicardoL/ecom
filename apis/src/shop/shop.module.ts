import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from './../auth/auth.module';

import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';

import { Shop } from './entities';


@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [
    TypeOrmModule.forFeature([ Shop ]),
    AuthModule,
  ],
  exports: [
    ShopService,
    TypeOrmModule,
  ]
})
export class ShopModule {}
