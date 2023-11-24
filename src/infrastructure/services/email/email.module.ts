import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { EmailSenderService } from './email.service';
import { EmailService } from './emailer.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: async (config: EnvironmentConfigService) => {
        return {
          transport: {
            host: config.getMailHost(),
            secure: config.getMailUseSSL(),
            port: config.getMailPort(),
            auth: {
              user: config.getMailUser(),
              pass: config.getMailPassword(),
            },
            pool: true,
          },
          defaults: {
            from: `"No Reply" <${config.getMailFrom()}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [TemplateService, EmailService, EmailSenderService],
  exports: [EmailService],
})
export class EmailModule {}
