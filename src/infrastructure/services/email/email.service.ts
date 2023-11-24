import { Injectable } from '@nestjs/common';
import {
  IEmailSenderService,
  SendEmailDto,
} from '@domain/adapters/email.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailSenderService implements IEmailSenderService {
  constructor(private readonly nodeMailer: MailerService) {}

  async send(data: SendEmailDto): Promise<void> {
    await this.nodeMailer.sendMail({
      to: data.to,
      subject: data.subject,
      html: data.message,
      attachments: data.attachments,
    });
  }
}
