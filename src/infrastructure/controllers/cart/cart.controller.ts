import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CartItemPresenter } from './cart.presenter';

import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { ApiHeaders } from '@infrastructure/common/decorators/api.decorator';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { IJwtLoginPayload } from '@domain/adapters/jwt.interface';
import { CurrentUser } from '@infrastructure/common/decorators/currentUser';
import { GetCartUseCases } from '@usecases/cart/get-cart.usecases';

@Controller('cart')
@ApiTags('Cart')
@ApiHeaders()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class CartController {
  private logger = new LoggerService(CartController.name);

  constructor(
    @Inject(UsecasesProxyModule.GET_CART_USECASES_PROXY)
    private readonly getCartUseCase: UseCaseProxy<GetCartUseCases>,
  ) {}

  @Get('')
  @ApiOperation({
    summary: "Get the user's cart",
    description: 'Use this route to get the cart of the logged in user',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The cart of the logged in user',
    type: [CartItemPresenter],
  })
  // @CurrentUser() user: IJwtLoginPayload
  async getUser() {
    const email = 'alice@prisma.io'; // user.id
    const cart = await this.getCartUseCase.getInstance().getCartItems(email);
    return cart.map((cartItem) => new CartItemPresenter(cartItem));
  }
}
