import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const core = require('cors');
  const bodyParser = require('body-parser');

  app.use(bodyParser.json());
  app.use(core({
    credentials: true,
    origin: ['http://localhost:8080']
  }))
  await app.listen(4001);
}
bootstrap();
