import { LoggerService } from '@infrastructure/logger/logger.service';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import {
  CreateWaitListDTO,
  WaitListRepository,
} from '@domain/repositories/waitlist.interface';

export class WaitListUseCases {
  constructor(
    private readonly logger: LoggerService,
    private readonly repository: WaitListRepository,
    private readonly exception: ExceptionsService,
  ) {}

  async create(obj: CreateWaitListDTO) {
    try {
      const waitList = await this.repository.create(obj);
      return waitList;
    } catch (e) {
      throw this.exception.badRequestException({
        message: 'Email already added to waitlist',
      });
    }
  }
}
