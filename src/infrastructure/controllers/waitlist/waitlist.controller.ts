import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { WaitListCreateDto } from './waitlist-dto.class';

import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { ApiHeaders } from '@infrastructure/common/decorators/api.decorator';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { WaitListUseCases } from '@usecases/waitlist/add';

@Controller('waitlist')
@ApiTags('WaitList')
@ApiHeaders()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class WaitListController {
  private logger = new LoggerService(WaitListController.name);

  constructor(
    @Inject(UsecasesProxyModule.WAITLIST_USECASES_PROXY)
    private readonly waitListUseCase: UseCaseProxy<WaitListUseCases>,
  ) {}

  @Post('add')
  @ApiBody({ type: WaitListCreateDto })
  @ApiOperation({
    summary: 'Add new waitlist',
  })
  @ApiOkResponse({
    description: 'WaitList created',
  })
  async create(@Body() body: WaitListCreateDto) {
    const waitList = await this.waitListUseCase.getInstance().create(body);
    return waitList;
  }
}
