
import { OAuth2 } from '@backstage/core-app-api';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  createApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  ProfileInfoApi,
  BackstageIdentityApi,
  SessionApi,
} from '@backstage/core-plugin-api';

export const myAsgardeoAuthApiRef = createApiRef<
  ProfileInfoApi & BackstageIdentityApi & SessionApi
>({
  id: 'my-asgardeo',
});

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: myAsgardeoAuthApiRef,
    deps: { discoveryApi: discoveryApiRef, oauthRequestApi: oauthRequestApiRef, configApi: configApiRef },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OAuth2.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        provider: {
          id: 'my-asgardeo',
          title: 'Sign in with Asgardeo',
          icon: () => null
        },
        environment: configApi.getOptionalString('auth.environment'),
        defaultScopes: ['openid', 'profile'],
      }),
  }),
];