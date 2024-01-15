import { LoggerService } from '@infrastructure/logger/logger.service';
import { CartRepository } from '@domain/repositories/cartRepository.interface';

export class GetCartUseCases {
  constructor(
    private readonly logger: LoggerService,
    private readonly cartRepository: CartRepository,
  ) {}
  async getCartItems(email: string) {
    return this.cartRepository.getCartItems(email);
  }
}
