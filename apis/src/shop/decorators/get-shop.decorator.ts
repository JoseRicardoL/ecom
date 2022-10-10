import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException
} from '@nestjs/common';


export const GetShop = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {

        const req = ctx.switchToHttp().getRequest();
        const shop = req.shop;

        if ( !shop )
            throw new InternalServerErrorException('Shop not found (request)');
        return ( !data )
            ? shop
            : shop[data];
    }
);