import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { CreateQuoteDTO } from './create-quote.dto';
import { QuoteService } from './quote.service';
import { Quotes } from './quotes.entity';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}
  @Post()
  async create(@Req() request: Request, @Body() createQuoteDTO: CreateQuoteDTO) {
    const quotes: Quotes = new Quotes();
    const userJwtPayload: JwtPayloadDto = request['user'];
    quotes.content = createQuoteDTO.content;
    quotes.image_url = createQuoteDTO.imageUrl;
    quotes.title = createQuoteDTO.title;
    quotes.user_id = userJwtPayload.sub;
    await this.quoteService.save(quotes);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAll(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Quotes[]> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.quoteService.findByUserId(userJwtPayload.sub, page, limit);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the quote' })
  async findOne(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Quotes> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.quoteService.findByUserIdAndPostId(userJwtPayload.sub, id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the quote' })
  async updateOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() createQuoteDTO: CreateQuoteDTO,
  ) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const quote: Quotes = await this.quoteService.findByUserIdAndPostId(
      userJwtPayload.sub,
      id,
    );
    if (quote.id == null) {
      throw new NotFoundException();
    }
    quote.content = createQuoteDTO.content;
    quote.image_url = createQuoteDTO.imageUrl;
    quote.title = createQuoteDTO.title;
    await this.quoteService.save(quote);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the quote' })
  async deleteOne(@Req() request: Request, @Param('id') id: number) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const quote: Quotes = await this.quoteService.findByUserIdAndPostId(
      userJwtPayload.sub,
      id,
    );
    if (quote.id == null) {
      throw new NotFoundException();
    }
    await this.quoteService.deleteById(id);
  }
}
