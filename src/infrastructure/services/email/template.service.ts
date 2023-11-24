import { Injectable } from '@nestjs/common';
import { ITemplateService } from '@domain/adapters/template.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as hbs from 'hbs';

@Injectable()
export class TemplateService implements ITemplateService {
  async createMessage(
    template: string,
    context: Record<string, unknown>,
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'resources',
      'templates',
      `${template}.hbs`,
    );
    return hbs.handlebars.compile(fs.readFileSync(templatePath, 'utf-8'))(
      context,
    );
  }
}
