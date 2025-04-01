import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter } from './all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(app.get(Logger));

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
