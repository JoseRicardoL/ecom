import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { Shop } from '../../shop/entities/shop.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    const shop = req.shop as Shop;

    if ( !user )
      throw new BadRequestException('User not found');

    if ( !shop )
      throw new BadRequestException('Shop not found');

    if(shop.user.id == user.id){
      return true;
    }

    throw new ForbiddenException(
      `User ${ user.fullName } need to be owned of: [${ shop.name }]`
    );
  }
}
