export interface SendEmailDto {
  to: string;
  subject: string;
  message: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
  }>;
}

export interface IEmailSenderService {
  send(sendEmailDto: SendEmailDto): Promise<void>;
}
