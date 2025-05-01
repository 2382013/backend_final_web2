import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuoteService } from './quote.service';
import { Quotes } from './quotes.entity';
import { Repository } from 'typeorm';

describe('QuoteService', () => {
  let service: QuoteService;
  let repo: Repository<Quotes>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: getRepositoryToken(Quotes),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
    repo = module.get<Repository<Quotes>>(getRepositoryToken(Quotes));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a quote', async () => {
    const quote = new Quotes();
    jest.spyOn(repo, 'save').mockResolvedValue(quote);
    expect(await service.save(quote)).toBe(quote);
  });
});
