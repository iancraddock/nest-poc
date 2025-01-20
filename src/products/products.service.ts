// Libraries
import * as fs from 'fs';
import * as path from 'path';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

// Helpers
import isUUID from '../helpers/uuid-helper';

// Functions
import validateAuthentication from './functions/validate-authentication';

// DTO
import { CreateProductDto } from './dto/create-product.dto';

// Types
import SupportedStatuses from './interfaces/supported-statuses';
import ResponseBody, { ResponseError } from './interfaces/response-body';
import { randomUUID } from 'crypto';

const readData = (filePath: string): any => {
  const data = fs.readFileSync(filePath, 'utf-8');
  const jsonData = JSON.parse(data);
  return jsonData;
};

const writeData = (filePath: string, data: any): Promise<any> => {
  const jsonData = JSON.stringify(data);
  return fs.promises.writeFile(path.resolve(__dirname, filePath), jsonData);
};

const productsMockPath = path.join(process.cwd(), 'src/mocks', 'mock-data.json');

@Injectable()
export class ProductsService {
  constructor(@InjectPinoLogger('idu.service') private readonly logger: PinoLogger) {
    this.logger = logger;
  }

  create(createProductDto: CreateProductDto, apiKey: string, clientId: string): Promise<ResponseBody> {
    return new Promise(async (resolve) => {
      const validApiKey = process.env.API_KEY;
      const validClientId = process.env.CLIENT_ID;
      let statusCode: SupportedStatuses = HttpStatus.CREATED;
      const isPayloadValid = {
        error: {
          message: 'Product already exists!',
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
      };

      // Validate API Key / ClientId
      if (!apiKey || !clientId || !isUUID(apiKey) || !isUUID(clientId)) {
        statusCode = HttpStatus.UNAUTHORIZED;
      }

      const isAuthenticated = validateAuthentication(apiKey, clientId, validApiKey, validClientId);

      if (isAuthenticated !== true && statusCode === HttpStatus.CREATED) {
        statusCode = HttpStatus.UNAUTHORIZED;
      }

      const products: CreateProductDto[] = await readData(productsMockPath);

      const product: CreateProductDto = products.find((product) => product.sku === createProductDto.sku);

      if (!product) {
        products.push(createProductDto);
        await writeData(productsMockPath, products);
      } else {
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      }

      // Return Response payload
      switch (statusCode) {
        case HttpStatus.CREATED: {
          resolve({
            status: HttpStatus.CREATED,
            orderId: randomUUID(),
          });
          return;
        }
        case HttpStatus.UNAUTHORIZED: {
          let error: ResponseError = {
            error: {
              message: 'Unauthorized',
              status: HttpStatus.UNAUTHORIZED,
            },
          };
          if (!isAuthenticated !== true) {
            error = isAuthenticated as ResponseError;
          }
          resolve(error);
          return [];
        }
        case HttpStatus.UNPROCESSABLE_ENTITY: {
          resolve(isPayloadValid);
          return [];
        }
        // case HttpStatus.INTERNAL_SERVER_ERROR: {
        //   resolve({
        //     error: HttpStatus.INTERNAL_SERVER_ERROR,
        //     message: 'Internal Server Error',
        //   });
        //   return;
        // }
        default:
          return [];
      }
    });
  }

  view(productSku: string): Promise<CreateProductDto | string> {
    return new Promise(async (resolve) => {
      const products: CreateProductDto[] = await readData(productsMockPath);

      const product = products.find((product) => product.sku === productSku);
      if (!product) {
        resolve('Product does not exist!');
      }
      resolve(product);
    });
  }
}
