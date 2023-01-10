import { Module } from '@nestjs/common';
import { GooglemapController } from './googlemap.controller';

@Module({
  controllers: [GooglemapController]
})
export class GooglemapModule {}
