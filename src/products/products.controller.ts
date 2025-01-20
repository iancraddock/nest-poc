// Libraries
import { Controller, Post, Body, Res, Headers, HttpStatus, Param, Get } from '@nestjs/common';
import { Response } from 'express';

// Services
import { ProductsService } from './products.service';

// DTO
import { CreateProductDto } from './dto/create-product.dto';
import ResponseBody from './interfaces/response-body';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Headers() headers: Record<string, string>,
    @Res({ passthrough: true }) response: Response,
    @Body() createProductDto: CreateProductDto
  ) {
    const apiKey = headers['api-key'];
    const clientId = headers['client-id'];

    const body: ResponseBody = await this.productsService.create(createProductDto, apiKey, clientId);

    console.log('body', body);

    if (body.error) {
      switch (body.error.status) {
        case HttpStatus.UNAUTHORIZED: {
          response.status(HttpStatus.UNAUTHORIZED);
          return body.error;
        }
        case HttpStatus.UNPROCESSABLE_ENTITY: {
          response.status(HttpStatus.UNPROCESSABLE_ENTITY);
          return body.error;
        }
        case HttpStatus.INTERNAL_SERVER_ERROR: {
          response.status(HttpStatus.INTERNAL_SERVER_ERROR);
          return body.error;
        }
        default:
          response.status(HttpStatus.OK);
          return body;
      }
    } else {
      response.status(HttpStatus.OK);
      return body;
    }
  }

  @Get(':id')
  view(@Param('id') id: string) {
    return this.productsService.view(id);
  }

  @Get()
  viewAll() {
    return this.productsService.viewAll();
  }
}
