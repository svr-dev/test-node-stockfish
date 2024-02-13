import { NestFactory } from '@nestjs/core';
import { AppModule } from "./app.module.js";

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule).catch((error) => {
    console.error('[Bootstrap] Application failed to start', error);
  });
}

bootstrap();