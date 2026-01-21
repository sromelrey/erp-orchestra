import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configures and sets up Swagger/OpenAPI documentation for the NestJS application.
 *
 * This function creates a Swagger document with basic API information and
 * configures the Swagger UI to be accessible at the specified path.
 * The documentation includes Bearer token authentication support.
 *
 * @param app - The NestJS application instance to configure
 */
export function setupSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('My Monolith API')
    .setDescription('The API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, doc);
}
