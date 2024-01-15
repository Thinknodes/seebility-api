export class CartM {
  id: string;
  userId: string;
  price: number;
  productId: string;
  quantity: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<CartM>) {
    Object.assign(this, data);
  }
}
