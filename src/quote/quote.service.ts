import { Injectable } from '@nestjs/common';
import { Quotes } from './quotes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(Quotes) private quoteRepository: Repository<Quotes>,
  ) {}

  async save(quote: Quotes): Promise<Quotes> {
    return this.quoteRepository.save(quote);
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Quotes[]> {
    return await this.quoteRepository.find({
      where: { user_id: userId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByUserIdAndPostId(userId: number, postId: number): Promise<Quotes> {
    const post = await this.quoteRepository.findOne({
      where: {
        user_id: userId,
        id: postId,
      },
    });
    if (!post) {
      return new Quotes();
    }
    return post;
  }

  async deleteById(postId: number) {
    await this.quoteRepository.delete({ id: postId });
  }
}
