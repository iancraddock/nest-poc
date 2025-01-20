import { HttpStatus } from '@nestjs/common';

type SupportedStatuses =
  | HttpStatus.CREATED
  | HttpStatus.UNAUTHORIZED
  | HttpStatus.UNPROCESSABLE_ENTITY
  | HttpStatus.INTERNAL_SERVER_ERROR;

export default SupportedStatuses;
