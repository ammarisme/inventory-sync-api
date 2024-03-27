import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enables CORS for all origins with default settings
  app.listen(3001, '0.0.0.0', () => {
    console.log(`Server is listening on port ${3001}`);
  });
}
bootstrap();
