import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  UseInterceptors,
  Get,
  Param,
  Sse,
  MessageEvent,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { SpeechCreateDto, UpdateSpeechDto } from './speech-dto.class';
import { SpeechPresenter } from './speech.presenter';

import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { ApiHeaders } from '@infrastructure/common/decorators/api.decorator';
import { SpeechUseCases } from '@usecases/speech/speech.usecases';
import { IJwtLoginPayload } from '@domain/adapters/jwt.interface';
import { CurrentUser } from '@infrastructure/common/decorators/currentUser';
import { GetSpeechUseCases } from '@usecases/speech/getSpeech.usecases';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { Observable, interval, map } from 'rxjs';

@Controller('speech')
@ApiTags('Speech')
@ApiHeaders()
@UseInterceptors(ClassSerializerInterceptor)
@ApiExtraModels(SpeechPresenter)
@ApiBearerAuth()
export class SpeechController {
  private logger = new LoggerService(SpeechController.name);

  constructor(
    @Inject(UsecasesProxyModule.SPEECH_USECASES_PROXY)
    private readonly speechUseCaseProxy: UseCaseProxy<SpeechUseCases>,
    @Inject(UsecasesProxyModule.GET_SPEECH_USECASES_PROXY)
    private readonly getSpeechUseCaseProxy: UseCaseProxy<GetSpeechUseCases>,
  ) {}

  @Post('create')
  @ApiBody({ type: SpeechCreateDto })
  @ApiOperation({
    summary: 'Create a new speech',
    description: 'Create a new speech',
  })
  @ApiOkResponse({
    description: 'Speech created',
    type: SpeechPresenter,
  })
  async createSpeech(
    @Body() body: SpeechCreateDto,
    @CurrentUser() user: IJwtLoginPayload,
  ) {
    const speech = await this.speechUseCaseProxy
      .getInstance()
      .createSpeech(body, user.id);
    return new SpeechPresenter(speech);
  }

  @Sse('stream/:id')
  @ApiOperation({
    summary: 'Stream speech by id',
    description: 'Use this route to stream speech by id',
  })
  @ApiOkResponse({
    description: 'The speech was retrieved successfully',
    type: SpeechPresenter,
  })
  @ApiParam({ name: 'id', type: String, description: 'Speech id' })
  async streamText(
    @Param('id') id: string,
    @CurrentUser() user: IJwtLoginPayload,
  ): Promise<Observable<MessageEvent>> {
    return this.speechUseCaseProxy.getInstance().streamSpeech(id, user.id);
  }

  @Post('update/:id')
  @ApiOperation({
    summary: 'Update speech by id',
    description: 'Use this route to update speech by id',
  })
  @ApiOkResponse({
    description: 'The speech was updated successfully',
    type: SpeechPresenter,
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, description: 'Speech id' })
  async updateSpeech(@Param('id') id: string, @Body() body: UpdateSpeechDto) {
    return this.speechUseCaseProxy.getInstance().updateSpeech({
      ...body,
      speechId: id,
    });
  }

  @Post('generate')
  @ApiBody({ type: SpeechCreateDto })
  @ApiOperation({
    summary: 'Create a new speech',
    description: 'Generate a new speech',
  })
  @ApiOkResponse({
    description: 'Speech created',
    type: SpeechPresenter,
  })
  async generateSpeech(
    @Body() body: SpeechCreateDto,
    @CurrentUser() user: IJwtLoginPayload,
  ) {
    const speech = await this.speechUseCaseProxy
      .getInstance()
      .generateSpeech(body, user.id);
    return new SpeechPresenter(speech);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get speeches for a user',
    description: 'Use this route to get speeches related to a user',
  })
  @ApiOkResponse({
    description: 'The speeches were retrieved successfully',
    type: [SpeechPresenter],
    isArray: true,
  })
  async getSpeechesByUserId(@CurrentUser() user: IJwtLoginPayload) {
    const speeches = await this.getSpeechUseCaseProxy
      .getInstance()
      .getSpeechesByUserId(user.id);
    return speeches.map((speech) => new SpeechPresenter(speech));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get speech by id',
    description: 'Use this route to get speech by id',
  })
  @ApiOkResponse({
    description: 'The speech was retrieved successfully',
    type: SpeechPresenter,
  })
  @ApiParam({ name: 'id', type: String, description: 'Speech id' })
  async getSpeech(@Param('id') id: string) {
    const speech = await this.getSpeechUseCaseProxy.getInstance().getSpeech(id);
    return new SpeechPresenter(speech);
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Create a new speech',
    description: 'Generate a new speech',
  })
  @ApiOkResponse({
    description: 'Speech created',
    type: SpeechPresenter,
  })
  @ApiParam({ name: 'id', type: String, description: 'Speech id' })
  @HttpCode(HttpStatus.OK)
  async deleteSpeech(
    @Param('id') id: string,
    @CurrentUser() user: IJwtLoginPayload,
  ) {
    const speech = await this.speechUseCaseProxy
      .getInstance()
      .deleteSpeech(id, user.id);
    return new SpeechPresenter(speech);
  }
}
