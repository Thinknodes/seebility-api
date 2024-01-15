import { CartM } from '../model/cart';

export interface CartRepository {
  getCartItems(email: string): Promise<CartM[]>;
  toModel(data: any): CartM;
}
