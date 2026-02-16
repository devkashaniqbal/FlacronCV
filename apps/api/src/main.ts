import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use(helmet());

  // CORS configuration - dynamically validate origins
  const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, ''); // Remove trailing slash
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    frontendUrl,
  ].filter(Boolean); // Remove undefined values

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Normalize origin by removing trailing slash
      const normalizedOrigin = origin.replace(/\/$/, '');

      // Check if normalized origin is in allowed list
      const isAllowed = allowedOrigins.some(
        (allowed) => allowed === normalizedOrigin || `${allowed}/` === origin
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('FlacronCV API')
    .setDescription('AI-powered CV & Cover Letter Builder API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('users')
    .addTag('cvs')
    .addTag('cover-letters')
    .addTag('ai')
    .addTag('templates')
    .addTag('payments')
    .addTag('support')
    .addTag('admin')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`FlacronCV API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
