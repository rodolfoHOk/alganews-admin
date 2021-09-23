import axios from 'axios';
import qs from 'qs';
import pkceChallenge from 'pkce-challenge';
import jwtDecode from 'jwt-decode';
import { Authentication } from './Auth';

const testToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGdhbmV3czp1c2VyX2Z1bGxfbmFtZSI6Ikpvw6NvIGRhIFNpbHZhIiwidXNlcl9uYW1lIjoiam9hby5nZXJAYWxnYW5ld3MuY29tLmJyIiwic2NvcGUiOlsiYWxsOndyaXRlIiwiYWxsOnJlYWQiLCJwb3N0OnJlYWQiXSwiYWxnYW5ld3M6dXNlcl9pZCI6MSwiZXhwIjoxNjMyMzU3NDY4LCJhdXRob3JpdGllcyI6WyJNQU5BR0VSIl0sImp0aSI6ImQ2ODhhOTFiLWZkNGUtNDI2ZC05Y2M2LTc0NGM3NGNhYjVmNiIsImNsaWVudF9pZCI6ImFsZ2FuZXdzLWFkbWluIn0.ZZfrsvJXpK0oZTTdNLVgVLFUNzPazyZdKCHgkCVr9UY';
const decodedToken: Authentication.AccessTokenDecodedBody =
  jwtDecode(testToken);
console.log(decodedToken);

export interface OAuthAuthorizationTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer' | string;
  expires_in: number;
  scope: string;
  [key: string]: string | number;
}

const authServer = axios.create({
  baseURL: 'http://localhost:8081',
});

authServer.interceptors.response.use(undefined, async (error) => {
  if (error?.response?.status === 401) {
    AuthorizationService.imperativelySendToLogout();
  }

  return Promise.reject(error);
});

export default class AuthorizationService {
  public static imperativelySendToLogout() {
    window.localStorage.clear();
    // codigo imperativo: gera efeito colateral
    window.location.href = `http://localhost:8081/logout?redirect=http://localhost:3000`;
  }

  public static async getNewToken(config: {
    refreshToken: string;
    codeVerifier: string;
  }) {
    const formUrlEncoded = qs.stringify({
      refresh_token: config.refreshToken,
      code_verifier: config.codeVerifier,
      grant_type: 'refresh_token',
      client_id: 'alganews-admin',
    });

    return authServer
      .post<OAuthAuthorizationTokenResponse>('/oauth/token', formUrlEncoded, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => res.data);
  }

  public static async getFirstAccessToken(config: {
    code: string;
    codeVerifier: string;
    redirectUri: string;
  }) {
    const data = {
      code: config.code,
      code_verifier: config.codeVerifier,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
      client_id: 'alganews-admin',
    };

    const encodedData = qs.stringify(data);

    return authServer
      .post<OAuthAuthorizationTokenResponse>('/oauth/token', encodedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => res.data);
  }

  public static getLoginScreenURL(codeChallenge: string) {
    const config = qs.stringify({
      response_type: 'code',
      client_id: 'alganews-admin',
      redirect_uri: `${window.location.origin}/authorize`,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `http://localhost:8081/oauth/authorize?${config}`;
  }

  public static async imperativelySendToLoginScreen() {
    const { code_challenge, code_verifier } = await pkceChallenge();
    this.setCodeVerifier(code_verifier);

    const loginUrl = this.getLoginScreenURL(code_challenge);

    // codigo imperativo: gera efeito colateral
    window.location.href = loginUrl;
  }

  public static getAccessToken() {
    return window.localStorage.getItem('accessToken');
  }

  public static setAccessToken(token: string) {
    return window.localStorage.setItem('accessToken', token);
  }

  public static getRefreshToken() {
    return window.localStorage.getItem('refreshToken');
  }

  public static setRefreshToken(refreshToken: string) {
    return window.localStorage.setItem('refreshToken', refreshToken);
  }

  public static getCodeVerifier() {
    return window.localStorage.getItem('codeVerifier');
  }

  public static setCodeVerifier(codeVerifier: string) {
    return window.localStorage.setItem('codeVerifier', codeVerifier);
  }
}
