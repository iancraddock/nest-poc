import { HttpStatus } from '@nestjs/common';

const validateAuthentication = (apiKey: string, clientId: string, validApiKey: string, validClientId: string) => {
  if (apiKey !== validApiKey || clientId !== validClientId || apiKey === undefined || clientId === undefined) {
    return {
      error: {
        status: HttpStatus.UNAUTHORIZED,
        message: `Invalid API Key or Client ID`,
      },
    };
  }

  return true;
};

export default validateAuthentication;
