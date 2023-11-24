import { Injectable } from '@nestjs/common';
import { RegisterOtpContext, ResetLinkContext } from './email.dto';
import { TemplateService } from './template.service';
import { EmailSenderService } from './email.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mail: EmailSenderService,
    private readonly template: TemplateService,
  ) {}

  async sendRegisterOtp(email: string, context: RegisterOtpContext) {
    await this.mail.send({
      to: email,
      subject: 'Verify your email',
      message: await this.template.createMessage('register', context),
    });
  }

  async sendResetLink(email: string, context: ResetLinkContext) {
    await this.mail.send({
      to: email,
      subject: 'Reset your password',
      message: await this.template.createMessage('reset-link', context),
    });
  }
}
