import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateWaitListDTO } from '@domain/repositories/waitlist.interface';

export class WaitListCreateDto implements CreateWaitListDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
