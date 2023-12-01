import { WaitListM } from '../model/waitlist';

export interface CreateWaitListDTO {
  email: string;
}

export interface WaitListRepository {
  create(data: WaitListM): Promise<WaitListM>;
}
