import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { CreateSpeechDTO } from '@usecases/speech/speech.usecases';
import { LengthType } from '@domain/model/speech';

export class SpeechCreateDto implements CreateSpeechDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly speaker: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly topic: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly story: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  readonly length: number;

  @ApiProperty({ required: true })
  @IsEnum(LengthType)
  @IsNotEmpty()
  readonly lengthType: LengthType;
}

export class UpdateSpeechDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly completedText: string;
}
