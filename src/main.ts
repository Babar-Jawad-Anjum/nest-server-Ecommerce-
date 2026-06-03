import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Project description
  app.setGlobalPrefix('api/v1');

  // Set global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Enable swagger docs
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the application')
    .addTag('auth', 'Auth related endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header'
      }, 'JWT-auth'
    )
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh-JWT',
        description: 'Enter Refresh JWT Token',
        in: 'header'
      }, 'JWT-refresh'
    )
    .addServer('http://localhost:3001', 'Development Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #4A90E2 }
    `,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
  Logger.error('Error starting server', error);
  process.exit(1);
});
