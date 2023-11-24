export enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
}

export interface EnvironmentConfig {
  getEnvironment(): Environment;
  getAppName(): string;
  getDefaultAdmin(): {
    username: string;
    password: string;
  };
  getSwaggerRoute(): string;
  getPort(): number;
  getApiKey(): string;
  getResetPasswordUrl(): string;
  getFrontendUrls(): string;
  isDevelopment(): boolean;
}
