import { HttpStatus } from '@nestjs/common';
import validateAuthentication from './validate-authentication';

describe('validateAuthentication', () => {
  it('should return an error if the API Key or Client ID is invalid', () => {
    const apiKey = 'invalid-api-key';
    const clientId = 'invalid-client-id';
    const validApiKey = 'valid-api-key';
    const validClientId = 'valid-client-id';

    const result = validateAuthentication(apiKey, clientId, validApiKey, validClientId);

    expect(result).toEqual({
      error: {
        status: HttpStatus.UNAUTHORIZED,
        message: `Invalid API Key or Client ID`,
      },
    });
  });

  it('should return true if the API Key and Client ID are valid', () => {
    const apiKey = 'valid-api-key';
    const clientId = 'valid-client-id';
    const validApiKey = 'valid-api-key';
    const validClientId = 'valid-client-id';

    const result = validateAuthentication(apiKey, clientId, validApiKey, validClientId);

    expect(result).toEqual(true);
  });
});
