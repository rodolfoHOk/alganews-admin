import Service from 'rodolfohiok-sdk/dist/Service';
import AuthorizationService from './Authorization.service';

Service.setRequestInterceptors(async (request) => {
  const storage = {
    accessToken: AuthorizationService.getAccessToken(),
  };
  const { accessToken } = storage;

  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return request;
});
