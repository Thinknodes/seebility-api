import { CartM } from '@domain/model/cart';
import { ApiResponseProperty } from '@nestjs/swagger';

export class CartItemPresenter implements CartM {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  userId: string;

  @ApiResponseProperty()
  price: number;

  @ApiResponseProperty()
  productId: string;

  @ApiResponseProperty()
  quantity: number;

  @ApiResponseProperty()
  image?: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  constructor(data: Partial<CartItemPresenter>) {
    Object.assign(this, data);
  }
}
