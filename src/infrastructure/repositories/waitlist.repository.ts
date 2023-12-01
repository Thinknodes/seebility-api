import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/drivers/prisma/prisma.service';
import {
  WaitListRepository,
  CreateWaitListDTO,
} from '@domain/repositories/waitlist.interface';
import { WaitListM } from '@domain/model/waitlist';

@Injectable()
export class WaitlistRepositoryImp implements WaitListRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(obj: CreateWaitListDTO): Promise<WaitListM> {
    return this.prismaService.waitList.create({
      data: { email: obj.email },
    });
  }
}
