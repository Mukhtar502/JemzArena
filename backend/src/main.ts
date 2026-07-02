import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strips properties not defined in your DTO
      transform: true, // 👈 CRITICAL: Converts incoming string numbers to actual number types
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('JemzArena API')
    .setDescription('OpenAPI documentation for the JemzArena backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Get PrismaService by class reference to check database connection before starting server
  const prismaService = app.get(PrismaService);

  try {
    // Explicitly check database connection - fail fast if not available
    await prismaService.$queryRaw`SELECT 1`;
    console.log('✅ Database connection verified');
  } catch (error) {
    console.error('❌ Failed to connect to database at startup:', error);
    await app.close();
    process.exit(1);
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on port ${process.env.PORT ?? 3000}`);
}

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});
