import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { ControllersModule } from '@infrastructure/controllers/controllers.module';
import SwaggerInit from '@infrastructure/common/swagger/swagger';
import * as cookieParser from 'cookie-parser';
import { Environment } from '@domain/config/environment.interface';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const configService = app.get(EnvironmentConfigService);
  const port = configService.getPort() || 3000;
  const swaggerRoute = configService.getSwaggerRoute();
  const mode = configService.getEnvironment();
  const frontendUrls = configService.getFrontendUrls();

  // Configure swagger
  const modules = [AppModule, ControllersModule];
  SwaggerInit(app, modules);

  // Configure CORS
  let allowedOrigins: (string | RegExp)[] = [];
  if (mode == Environment.Development) {
    allowedOrigins = [/localhost/, /vercel\.app/];
    app.enableCors({
      origin: allowedOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders:
        'Content-Type, Accept, Authorization, x-api-key, refresh, cache-control',
      credentials: true,
    });
  } else {
    allowedOrigins = [...allowedOrigins, ...frontendUrls.split(',')];
    app.enableCors({
      origin: allowedOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders:
        'Content-Type, Accept, Authorization, x-api-key, refresh, cache-control',
      credentials: true,
    });
  }

  await app.listen(port);

  logger.log(`Server running on port ${port}.\nUrl: ${await app.getUrl()}`);
  logger.log(`Swagger running on: ${await app.getUrl()}/${swaggerRoute}`);
}
bootstrap();
