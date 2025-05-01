import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotes } from './quotes.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quotes, User])],

  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
