import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { applyMiddlewares } from '@/middlewares/index';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Bootstraps and starts the NestJS application.
 *
 * This function initializes the application with:
 * - Global validation pipes for request data validation
 * - API prefix configuration
 * - Middleware setup (authentication, CORS, etc.)
 * - Swagger documentation setup
 * - Dynamic port configuration from environment
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  applyMiddlewares(app);
  const configService = app.get(ConfigService);
  const port =
    Number(configService.get('PORT')) || Number(process.env.PORT) || 3000;

  /*
   * ✅ Swagger configuration
   */

  const config = new DocumentBuilder()
    .setTitle('Scale Suite API')
    .setDescription('The API documentation')
    .setTermsOfService(`http://localhost:${port}/terms-of-service`)
    .setLicense('MIT License', '')
    .addServer(`http://localhost:${port}`)
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, doc);
  await app.listen(port);
}
bootstrap();
