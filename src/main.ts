import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplicationExceptionFilter } from './shared/infrastructure/filters/application-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableShutdownHooks();
  app.useGlobalFilters(new ApplicationExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
