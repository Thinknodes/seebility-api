export interface RedisConfig {
  getRedisHost(): string;
  getRedisPort(): number;
  getRedisPassword(): string;
  getRedisDB(): number;
  getRedisSSL(): boolean;
  getRedisURL(): string;
}
