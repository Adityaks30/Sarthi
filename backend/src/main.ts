import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for Angular frontend
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

