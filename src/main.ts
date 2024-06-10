import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enables CORS for all origins with default settings

  const config = new DocumentBuilder()
  .setTitle('Seller Stack API')
  .setDescription('API to communicate with the Seller Stack Core.')
  .setVersion('1.0')
  .addTag('tag')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);


  app.listen(3001, '0.0.0.0', () => {
    console.log(`Server is listening on port ${3001}`);
  });
}
bootstrap();
