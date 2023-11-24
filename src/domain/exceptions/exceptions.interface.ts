export interface IFormatExceptionMessage {
  message: string;
  code_error?: number;
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): Error;
  internalServerErrorException(data?: IFormatExceptionMessage): Error;
  forbiddenException(data?: IFormatExceptionMessage): Error;
  unauthorizedException(data?: IFormatExceptionMessage): Error;
  notFoundException(data?: IFormatExceptionMessage): Error;
}
