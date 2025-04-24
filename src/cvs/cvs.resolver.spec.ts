import { Test, TestingModule } from '@nestjs/testing';
import { CvsResolver } from './cvs.resolver';
import { CvsService } from './cvs.service';

describe('CvsResolver', () => {
  let resolver: CvsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvsResolver, CvsService],
    }).compile();

    resolver = module.get<CvsResolver>(CvsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
