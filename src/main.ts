import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppLogger } from './infra/logger/app.logger';
import { correlationIdMiddleware } from './infra/logger/correlation-id.middleware';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
        logger: new AppLogger(),
    })
  const config = new DocumentBuilder()
    .setTitle('Secret Santa API')
    .setDescription('API para sorteio de amigo secreto')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  app.use(correlationIdMiddleware)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();