import { Test, TestingModule } from '@nestjs/testing';
import { GooglemapController } from './googlemap.controller';

describe('GooglemapController', () => {
  let controller: GooglemapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GooglemapController],
    }).compile();

    controller = module.get<GooglemapController>(GooglemapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
