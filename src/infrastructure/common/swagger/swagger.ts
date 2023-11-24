import { Environment } from '@domain/config/environment.interface';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

export default function SwaggerInit(
  app: INestApplication,
  // eslint-disable-next-line @typescript-eslint/ban-types
  modules: Function[],
) {
  const configService = app.get(EnvironmentConfigService);

  const appName = `${configService.getAppName()} API`;

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`API documentation for ${appName}`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: appName,
    useGlobalPrefix: false,
  };

  const NODE_ENV = configService.getEnvironment();

  const swaggerRoute = configService.getSwaggerRoute();

  const document = SwaggerModule.createDocument(app, config, {
    include: modules,
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });

  if (NODE_ENV != Environment.Development) {
    const admin = configService.getDefaultAdmin();

    app.use(
      swaggerRoute,
      basicAuth({
        challenge: true,
        users: { [admin.username]: admin.password },
      }),
    );
  }

  SwaggerModule.setup(swaggerRoute, app, document, customOptions);
}
