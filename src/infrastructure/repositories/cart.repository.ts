import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/drivers/prisma/prisma.service';
import { CartRepository } from '@domain/repositories/cartRepository.interface';
import { CartM } from '@domain/model/cart';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartRepositoryImp implements CartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getCartItems(email: string): Promise<CartM[]> {
    const carts = await this.prismaService.cartItem.findMany({
      where: {
        user: {
          email,
        },
      },
    });
    return carts.map((cart) => this.toModel(cart));
  }

  toModel(data: CartItem): CartM {
    return new CartM(data);
  }
}
