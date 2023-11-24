import { Injectable } from '@nestjs/common';
import {
  RegisterDTO,
  UserRepository,
} from '../../domain/repositories/userRepository.interface';
import { PrismaService } from '@infrastructure/drivers/prisma/prisma.service';
import { RegisterDto } from '@infrastructure/controllers/auth/auth-dto.class';
import { UserM } from '@domain/model/user';
import { User } from '@prisma/client';

@Injectable()
export class UserRepositoryImp implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
  async updateProfile(
    data: Omit<Partial<UserM>, 'modeOfSignUp'>,
    id: string,
  ): Promise<UserM> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
    return user ? this.toModel(user) : null;
  }

  async updatePassword(id: string, password: string) {
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }

  toModel(data: User): UserM {
    return new UserM(data);
  }

  async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user ? this.toModel(user) : null;
  }

  async updateLastLogin(id: string) {
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }

  async createUser(data: RegisterDto) {
    const { email, password, name } = data;
    const newUser = await this.prismaService.user.create({
      data: {
        email,
        password,
        name,
      },
    });
    return newUser ? this.toModel(newUser) : null;
  }

  async createOauthUser(data: RegisterDTO) {
    const newUser = await this.prismaService.user.create({
      data: {
        ...data,
        password: '',
      },
    });
    return newUser ? this.toModel(newUser) : null;
  }
}
