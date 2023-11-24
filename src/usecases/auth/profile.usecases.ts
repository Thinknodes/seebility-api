import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { UserM } from '@domain/model/user';

export class ProfileUseCases {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly exception: ExceptionsService,
    private readonly bcrypt: BcryptService,
  ) {}
  async updateProfile(data: Pick<UserM, 'name' | 'image'>, id: string) {
    return this.userRepository.updateProfile(data, id);
  }
  async updatePassword(id: string, password: string) {
    const hashedPassword = await this.bcrypt.hash(password);
    return this.userRepository.updatePassword(id, hashedPassword);
  }
  async updateEmail(id: string, email: string) {
    return this.userRepository.updateProfile({ email }, id);
  }
  async deleteAccount(id: string) {
    return this.userRepository.delete(id);
  }
}
